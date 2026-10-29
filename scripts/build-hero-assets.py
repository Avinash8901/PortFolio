#!/usr/bin/env python3
"""Build the self-hosted hero loop, portrait and Open Graph image.

The supplied 1920x1080 introduction has the subject centred. The crop below
was measured from the source frame and keeps the full figure in a portrait
composition. Override it with --crop x,y,width,height if the source changes.
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "intro.mp4"
HERO_DIR = ROOT / "public" / "hero"
PORTRAIT_DIR = ROOT / "public" / "portrait"
PUBLIC_DIR = ROOT / "public"
SAMPLE_RATE = 48_000
CROSSFADE_SECONDS = 0.5
CLIP_SECONDS = 9.96
VIDEO_CROP = (520, 16, 840, 1048)
PORTRAIT_CROP = (680, 25, 520, 650)


def find_ffmpeg() -> str:
    binary = shutil.which("ffmpeg")
    if binary:
        return binary
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError as exc:
        raise RuntimeError(
            "FFmpeg was not found. Install FFmpeg or run `pip install imageio-ffmpeg`."
        ) from exc


def run(command: list[str]) -> None:
    subprocess.run(command, check=True)


def parse_crop(value: str) -> tuple[int, int, int, int]:
    try:
        x, y, width, height = (int(part.strip()) for part in value.split(","))
    except (ValueError, TypeError) as exc:
        raise argparse.ArgumentTypeError("Crop must be x,y,width,height") from exc
    if width <= 0 or height <= 0:
        raise argparse.ArgumentTypeError("Crop width and height must be positive")
    return x, y, width, height


def export_audio_loop(ffmpeg: str, source: Path, target: Path) -> int:
    """Crossfade PCM samples with a cosine/sine equal-power curve."""
    with tempfile.TemporaryDirectory(prefix="portfolio-audio-") as temp:
        raw = Path(temp) / "source.f32"
        run(
            [
                ffmpeg, "-y", "-v", "error", "-i", str(source), "-t",
                str(CLIP_SECONDS), "-vn", "-ac", "2", "-ar", str(SAMPLE_RATE),
                "-f", "f32le", str(raw),
            ]
        )
        audio = np.fromfile(raw, dtype="<f4").reshape(-1, 2)

    fade_samples = round(CROSSFADE_SECONDS * SAMPLE_RATE)
    start = round(CROSSFADE_SECONDS * SAMPLE_RATE)
    end = min(len(audio), round(CLIP_SECONDS * SAMPLE_RATE))
    middle_end = end - fade_samples
    if middle_end <= start:
        raise RuntimeError("The source audio is shorter than the configured loop.")

    tail = audio[middle_end:end]
    head = audio[:fade_samples]
    phase = np.linspace(0.0, np.pi / 2, fade_samples, endpoint=True, dtype=np.float32)
    crossfade = tail * np.cos(phase)[:, None] + head * np.sin(phase)[:, None]
    loop = np.concatenate((audio[start:middle_end], crossfade), axis=0)
    loop.astype("<f4", copy=False).tofile(target)
    return len(loop)


def create_hero_video(ffmpeg: str, source: Path, crop: tuple[int, int, int, int]) -> None:
    x, y, width, height = crop
    fade = CROSSFADE_SECONDS
    mid_start = fade
    mid_end = CLIP_SECONDS - fade
    crop_filter = (
        f"crop={width}:{height}:{x}:{y},"
        "colorlevels=rimax=0.92:gimax=0.92:bimax=0.92,"
        "scale=768:960:flags=lanczos,setsar=1,format=yuv420p"
    )

    with tempfile.TemporaryDirectory(prefix="portfolio-hero-") as temp:
        video_only = Path(temp) / "loop-video.mp4"
        audio_raw = Path(temp) / "loop-audio.f32"
        audio_wav = Path(temp) / "loop-audio.wav"
        audio_samples = export_audio_loop(ffmpeg, source, audio_raw)
        loop_duration = audio_samples / SAMPLE_RATE
        run(
            [
                ffmpeg, "-y", "-v", "error", "-i", str(source),
                "-filter_complex",
                (
                    f"[0:v]{crop_filter},split=3[mid_in][tail_in][head_in];"
                    f"[mid_in]trim=start={mid_start}:end={mid_end},setpts=PTS-STARTPTS,fps=24,settb=AVTB[mid];"
                    f"[tail_in]trim=start={mid_end}:end={CLIP_SECONDS},setpts=PTS-STARTPTS,fps=24,settb=AVTB[tail];"
                    f"[head_in]trim=start=0:end={fade},setpts=PTS-STARTPTS,fps=24,settb=AVTB[head];"
                    f"[tail][head]xfade=transition=fade:duration={fade}:offset=0[cross];"
                    "[mid][cross]concat=n=2:v=1:a=0[outv]"
                ),
                "-map", "[outv]", "-an", "-t", f"{loop_duration:.6f}",
                "-c:v", "libx264", "-crf", "24", "-preset", "slow",
                "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(video_only),
            ]
        )
        run(
            [
                ffmpeg, "-y", "-v", "error", "-f", "f32le", "-ar",
                str(SAMPLE_RATE), "-ac", "2", "-i", str(audio_raw),
                "-c:a", "pcm_s16le", str(audio_wav),
            ]
        )
        HERO_DIR.mkdir(parents=True, exist_ok=True)
        mp4 = HERO_DIR / "hero.mp4"
        webm = HERO_DIR / "hero.webm"
        run(
            [
                ffmpeg, "-y", "-v", "error", "-i", str(video_only), "-i", str(audio_wav),
                "-map", "0:v:0", "-map", "1:a:0", "-t", f"{loop_duration:.6f}",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "96k", "-movflags",
                "+faststart", str(mp4),
            ]
        )
        run(
            [
                ffmpeg, "-y", "-v", "error", "-i", str(video_only), "-i", str(audio_wav),
                "-map", "0:v:0", "-map", "1:a:0", "-t", f"{loop_duration:.6f}",
                "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-c:a", "libopus",
                "-b:a", "80k", str(webm),
            ]
        )


def create_portrait(ffmpeg: str, source: Path) -> Path:
    x, y, width, height = PORTRAIT_CROP
    PORTRAIT_DIR.mkdir(parents=True, exist_ok=True)
    portrait = PORTRAIT_DIR / "portrait-bust.webp"
    run(
        [
            ffmpeg, "-y", "-v", "error", "-ss", "1.0", "-i", str(source),
            "-frames:v", "1", "-vf",
            (
                f"crop={width}:{height}:{x}:{y},"
                "colorlevels=rimax=0.92:gimax=0.92:bimax=0.92,"
                "scale=480:600:flags=lanczos"
            ),
            "-quality", "88", str(portrait),
        ]
    )
    return portrait


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
        Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def create_og_image(portrait_path: Path) -> None:
    canvas = Image.new("RGB", (1200, 630), "#f4f2ee")
    draw = ImageDraw.Draw(canvas)
    draw.text((70, 80), "PORTFOLIO / 2026", font=load_font(18), fill="#77756f")
    draw.text((70, 198), "Avinash", font=load_font(88, bold=True), fill="#0d0d0d")
    draw.text((70, 292), "Batchu", font=load_font(88, bold=True), fill="#0d0d0d")
    draw.text((76, 410), "Backend Software Engineer", font=load_font(30), fill="#3a3a3a")
    draw.line((76, 477, 610, 477), fill="#cfccc5", width=1)
    draw.text((76, 510), "Hyderabad, India", font=load_font(18), fill="#77756f")
    portrait = Image.open(portrait_path).convert("RGBA")
    portrait = portrait.resize((330, 412), Image.Resampling.LANCZOS)
    mask = Image.new("L", portrait.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 329, 411), radius=165, fill=255)
    portrait.putalpha(mask)
    canvas.paste(portrait, (790, 130), portrait)
    draw.rounded_rectangle((790, 130, 1120, 542), radius=165, outline="#cfccc5", width=2)
    canvas.save(PUBLIC_DIR / "og.jpg", quality=90, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument(
        "--crop", type=parse_crop, default=VIDEO_CROP,
        help="Hero crop as x,y,width,height (default: measured for the supplied intro)",
    )
    args = parser.parse_args()
    source = args.source.resolve()
    if not source.is_file():
        raise SystemExit(f"Video source not found: {source}")

    ffmpeg = find_ffmpeg()
    create_hero_video(ffmpeg, source, args.crop)
    portrait = create_portrait(ffmpeg, source)
    create_og_image(portrait)
    print(f"Created {HERO_DIR / 'hero.mp4'}")
    print(f"Created {HERO_DIR / 'hero.webm'}")
    print(f"Created {portrait}")
    print(f"Created {PUBLIC_DIR / 'og.jpg'}")


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, subprocess.CalledProcessError) as error:
        print(error, file=sys.stderr)
        raise SystemExit(1)
