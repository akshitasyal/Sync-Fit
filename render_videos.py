import os
import math
import numpy as np
from PIL import Image, ImageDraw
import imageio

OUTPUT_DIR = os.path.join(os.getcwd(), "public", "videos", "exercises")
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH = 640
HEIGHT = 400
FPS = 30
DURATION_SEC = 3
TOTAL_FRAMES = FPS * DURATION_SEC

# Visual Palette
BG_DARK = (14, 16, 22)
FLOOR_COLOR = (24, 28, 38)
GRID_LINE = (35, 40, 52)
ACCENT_GREEN = (193, 255, 0)
BODY_CORE = (235, 240, 250)
BODY_LIMBS = (185, 195, 210)
EQUIPMENT_YELLOW = (255, 185, 0)
BAR_CHROME = (225, 230, 240)
BENCH_COLOR = (45, 50, 65)
FRAME_DARK = (60, 66, 82)
CABLE_COLOR = (150, 160, 180)

def draw_gym_background(draw, custom_floor_y=None):
    draw.rectangle([0, 0, WIDTH, HEIGHT], fill=BG_DARK)
    floor_y = custom_floor_y if custom_floor_y is not None else int(HEIGHT * 0.78)
    draw.rectangle([0, floor_y, WIDTH, HEIGHT], fill=FLOOR_COLOR)
    draw.line([0, floor_y, WIDTH, floor_y], fill=(50, 56, 72), width=2)
    for x in range(40, WIDTH, 80):
        draw.line([x, floor_y, x + (x - WIDTH//2)//2, HEIGHT], fill=GRID_LINE, width=1)
    draw.ellipse([WIDTH//2 - 140, floor_y - 180, WIDTH//2 + 140, floor_y + 60], fill=(22, 26, 36))

def get_loop_phase(frame_idx, total_frames):
    t = frame_idx / total_frames
    return (1.0 - math.cos(t * 2 * math.pi)) / 2.0

# ══════════════════════════════════════════════════════════════════════════════
# 1. INCLINE DUMBBELL PRESS (35° Incline Bench + TWO Separate Dumbbells)
# ══════════════════════════════════════════════════════════════════════════════
def render_incline_dumbbell_press(frame_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    floor_y = int(HEIGHT * 0.80)
    draw_gym_background(draw, floor_y)
    
    phase = get_loop_phase(frame_idx, TOTAL_FRAMES)
    base_x = WIDTH // 2
    bench_y = floor_y - 45
    
    bench_bottom = (base_x - 40, bench_y)
    bench_top = (base_x - 125, bench_y - 85)
    seat_front = (base_x + 10, bench_y - 5)
    
    draw.line([bench_bottom, seat_front], fill=BENCH_COLOR, width=12)
    draw.line([bench_bottom, bench_top], fill=BENCH_COLOR, width=16)
    draw.line([(base_x - 85, bench_y - 45), (base_x - 85, floor_y)], fill=FRAME_DARK, width=8)
    draw.line([(base_x - 10, bench_y), (base_x - 10, floor_y)], fill=FRAME_DARK, width=8)
    
    head_pos = (bench_top[0] + 15, bench_top[1] - 12)
    hip_pos = (bench_bottom[0] + 10, bench_bottom[1] - 10)
    shoulder_pos = (bench_top[0] + 35, bench_top[1] + 25)
    
    draw.ellipse([head_pos[0]-13, head_pos[1]-13, head_pos[0]+13, head_pos[1]+13], fill=BODY_CORE)
    draw.line([shoulder_pos, hip_pos], fill=BODY_CORE, width=18)
    
    knee_pos = (hip_pos[0] + 45, bench_y - 15)
    foot_pos = (hip_pos[0] + 55, floor_y)
    draw.line([hip_pos, knee_pos], fill=BODY_CORE, width=11)
    draw.line([knee_pos, foot_pos], fill=BODY_LIMBS, width=9)
    draw.line([foot_pos[0]-10, foot_pos[1], foot_pos[0]+10, foot_pos[1]], fill=BODY_CORE, width=5)
    
    press_dist = phase * 55
    db1_x = shoulder_pos[0] + 10 + int(press_dist * 0.6)
    db1_y = shoulder_pos[1] - 25 - int(press_dist * 0.8)
    db2_x = shoulder_pos[0] + 40 + int(press_dist * 0.6)
    db2_y = shoulder_pos[1] - 10 - int(press_dist * 0.8)
    
    elbow1 = (shoulder_pos[0] - 15, shoulder_pos[1] + 15 - int(phase * 15))
    draw.line([shoulder_pos, elbow1], fill=BODY_LIMBS, width=7)
    draw.line([elbow1, (db1_x, db1_y)], fill=BODY_CORE, width=7)
    
    elbow2 = (shoulder_pos[0] + 15, shoulder_pos[1] + 25 - int(phase * 15))
    draw.line([shoulder_pos, elbow2], fill=BODY_LIMBS, width=7)
    draw.line([elbow2, (db2_x, db2_y)], fill=BODY_CORE, width=7)
    
    # Dumbbell 1
    draw.line([db1_x - 12, db1_y - 8, db1_x + 12, db1_y + 8], fill=BAR_CHROME, width=4)
    draw.rectangle([db1_x - 16, db1_y - 14, db1_x - 8, db1_y - 2], fill=EQUIPMENT_YELLOW)
    draw.rectangle([db1_x + 8, db1_y + 2, db1_x + 16, db1_y + 14], fill=EQUIPMENT_YELLOW)
    
    # Dumbbell 2
    draw.line([db2_x - 12, db2_y - 8, db2_x + 12, db2_y + 8], fill=BAR_CHROME, width=4)
    draw.rectangle([db2_x - 16, db2_y - 14, db2_x - 8, db2_y - 2], fill=EQUIPMENT_YELLOW)
    draw.rectangle([db2_x + 8, db2_y + 2, db2_x + 16, db2_y + 14], fill=EQUIPMENT_YELLOW)
    
    return np.array(img)

# ══════════════════════════════════════════════════════════════════════════════
# 2. PULL-UPS (Hanging Body Moving UP to Fixed Horizontal Bar)
# ══════════════════════════════════════════════════════════════════════════════
def render_pull_up(frame_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    floor_y = int(HEIGHT * 0.85)
    draw_gym_background(draw, floor_y)
    
    phase = get_loop_phase(frame_idx, TOTAL_FRAMES)
    base_x = WIDTH // 2
    
    bar_y = 55
    draw.line([base_x - 110, bar_y, base_x + 110, bar_y], fill=BAR_CHROME, width=6)
    draw.line([base_x - 100, bar_y, base_x - 100, floor_y], fill=FRAME_DARK, width=8)
    draw.line([base_x + 100, bar_y, base_x + 100, floor_y], fill=FRAME_DARK, width=8)
    
    body_rise = phase * 95
    hand_l = (base_x - 45, bar_y)
    hand_r = (base_x + 45, bar_y)
    
    shoulder_y = 150 - body_rise
    head_y = shoulder_y - 22
    hip_y = shoulder_y + 75
    
    draw.ellipse([base_x - 13, head_y - 13, base_x + 13, head_y + 13], fill=BODY_CORE)
    draw.line([(base_x, shoulder_y), (base_x, hip_y)], fill=BODY_CORE, width=18)
    
    elbow_l = (base_x - 55 - int(phase * 15), shoulder_y + int(phase * 25))
    elbow_r = (base_x + 55 + int(phase * 15), shoulder_y + int(phase * 25))
    
    draw.line([(base_x - 8, shoulder_y), elbow_l], fill=BODY_LIMBS, width=7)
    draw.line([elbow_l, hand_l], fill=BODY_CORE, width=7)
    draw.line([(base_x + 8, shoulder_y), elbow_r], fill=BODY_LIMBS, width=7)
    draw.line([elbow_r, hand_r], fill=BODY_CORE, width=7)
    
    knee_l = (base_x - 15, hip_y + 45)
    knee_r = (base_x + 15, hip_y + 45)
    foot_l = (base_x - 10, knee_l[1] + 40)
    foot_r = (base_x + 10, knee_r[1] + 40)
    
    draw.line([(base_x - 6, hip_y), knee_l], fill=BODY_CORE, width=10)
    draw.line([knee_l, foot_l], fill=BODY_LIMBS, width=8)
    draw.line([(base_x + 6, hip_y), knee_r], fill=BODY_CORE, width=10)
    draw.line([knee_r, foot_r], fill=BODY_LIMBS, width=8)
    
    return np.array(img)

# ══════════════════════════════════════════════════════════════════════════════
# 3. LAT PULLDOWN (Seated Machine - BAR MOVES DOWN TO SEATED BODY)
# ══════════════════════════════════════════════════════════════════════════════
def render_lat_pulldown(frame_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    floor_y = int(HEIGHT * 0.80)
    draw_gym_background(draw, floor_y)
    
    phase = get_loop_phase(frame_idx, TOTAL_FRAMES)
    base_x = WIDTH // 2
    
    draw.rectangle([base_x - 8, 20, base_x + 8, floor_y], fill=FRAME_DARK)
    draw.ellipse([base_x - 18, 22, base_x + 18, 54], fill=(75, 82, 98))
    
    seat_y = floor_y - 70
    draw.rectangle([base_x - 45, seat_y, base_x + 15, seat_y + 12], fill=BENCH_COLOR)
    draw.ellipse([base_x - 10, seat_y - 30, base_x + 25, seat_y - 18], fill=FRAME_DARK)
    
    hips = (base_x - 18, seat_y)
    shoulders = (base_x - 12, seat_y - 75)
    head = (base_x - 12, seat_y - 95)
    
    draw.line([hips, shoulders], fill=BODY_CORE, width=18)
    draw.ellipse([head[0]-13, head[1]-13, head[0]+13, head[1]+13], fill=BODY_CORE)
    
    knee = (base_x + 20, seat_y - 20)
    foot = (base_x + 35, floor_y)
    draw.line([hips, knee], fill=BODY_CORE, width=12)
    draw.line([knee, foot], fill=BODY_LIMBS, width=9)
    
    bar_y = 65 + int(phase * 75)
    draw.line([(base_x, 38), (base_x, bar_y)], fill=CABLE_COLOR, width=2)
    draw.line([base_x - 90, bar_y, base_x + 90, bar_y], fill=BAR_CHROME, width=5)
    draw.line([base_x - 90, bar_y, base_x - 100, bar_y + 10], fill=BAR_CHROME, width=4)
    draw.line([base_x + 90, bar_y, base_x + 100, bar_y + 10], fill=BAR_CHROME, width=4)
    
    elbow_l = (base_x - 45 - int(phase * 20), shoulders[1] + 15 + int(phase * 25))
    elbow_r = (base_x + 35 + int(phase * 20), shoulders[1] + 15 + int(phase * 25))
    
    draw.line([(shoulders[0]-8, shoulders[1]), elbow_l], fill=BODY_LIMBS, width=7)
    draw.line([elbow_l, (base_x - 80, bar_y)], fill=BODY_CORE, width=7)
    draw.line([(shoulders[0]+8, shoulders[1]), elbow_r], fill=BODY_LIMBS, width=7)
    draw.line([elbow_r, (base_x + 80, bar_y)], fill=BODY_CORE, width=7)
    
    return np.array(img)

# ══════════════════════════════════════════════════════════════════════════════
# 4. LEG PRESS (Seated 45° Sled Machine)
# ══════════════════════════════════════════════════════════════════════════════
def render_leg_press(frame_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    floor_y = int(HEIGHT * 0.82)
    draw_gym_background(draw, floor_y)
    
    phase = get_loop_phase(frame_idx, TOTAL_FRAMES)
    
    rail_start = (WIDTH // 2 - 120, floor_y - 30)
    rail_end = (WIDTH // 2 + 140, floor_y - 230)
    draw.line([rail_start, rail_end], fill=(55, 62, 80), width=10)
    draw.line([(rail_start[0]+15, rail_start[1]+10), (rail_end[0]+15, rail_end[1]+10)], fill=(40, 45, 60), width=6)
    
    plate_top = (rail_end[0] - 15, rail_end[1] - 30)
    plate_bottom = (rail_end[0] + 25, rail_end[1] + 20)
    draw.line([plate_top, plate_bottom], fill=FRAME_DARK, width=12)
    
    seat_base = (rail_start[0] - 30, floor_y - 10)
    backrest_top = (rail_start[0] - 100, floor_y - 100)
    draw.line([seat_base, (seat_base[0] + 45, seat_base[1] - 25)], fill=BENCH_COLOR, width=14)
    draw.line([seat_base, backrest_top], fill=BENCH_COLOR, width=16)
    draw.line([seat_base, (seat_base[0] - 15, floor_y)], fill=FRAME_DARK, width=8)
    
    head_pos = (backrest_top[0] + 10, backrest_top[1] - 15)
    hip_pos = (seat_base[0] + 15, seat_base[1] - 10)
    shoulder_pos = (backrest_top[0] + 25, backrest_top[1] + 20)
    
    draw.ellipse([head_pos[0]-14, head_pos[1]-14, head_pos[0]+14, head_pos[1]+14], fill=BODY_CORE)
    draw.line([shoulder_pos, hip_pos], fill=BODY_CORE, width=18)
    draw.line([shoulder_pos, (hip_pos[0] - 10, hip_pos[1] + 10)], fill=BODY_LIMBS, width=7)
    
    sled_travel = phase * 70
    sled_x = rail_end[0] - 30 - int(sled_travel * 0.8)
    sled_y = rail_end[1] + 15 + int(sled_travel * 0.8)
    
    draw.line([(sled_x - 15, sled_y - 25), (sled_x + 15, sled_y + 15)], fill=(80, 88, 105), width=12)
    draw.rectangle([sled_x - 8, sled_y - 35, sled_x + 8, sled_y - 15], fill=EQUIPMENT_YELLOW)
    
    foot_pos = (sled_x - 5, sled_y - 5)
    knee_x = (hip_pos[0] + foot_pos[0]) // 2 - int(phase * 25)
    knee_y = (hip_pos[1] + foot_pos[1]) // 2 - 35 - int(phase * 20)
    
    draw.line([hip_pos, (knee_x, knee_y)], fill=BODY_CORE, width=12)
    draw.line([(knee_x, knee_y), foot_pos], fill=BODY_LIMBS, width=10)
    
    return np.array(img)

# ══════════════════════════════════════════════════════════════════════════════
# 5. GLUTE BRIDGE (Supine Floor Bridge - Hips Drive UP)
# ══════════════════════════════════════════════════════════════════════════════
def render_glute_bridge(frame_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    floor_y = int(HEIGHT * 0.76)
    draw_gym_background(draw, floor_y)
    
    phase = get_loop_phase(frame_idx, TOTAL_FRAMES)
    draw.rectangle([WIDTH//2 - 160, floor_y, WIDTH//2 + 160, floor_y + 6], fill=(45, 52, 68))
    
    base_x = WIDTH // 2
    head_pos = (base_x - 110, floor_y - 12)
    shoulder_pos = (base_x - 70, floor_y - 10)
    feet_pos = (base_x + 90, floor_y - 4)
    draw.line([feet_pos[0]-15, feet_pos[1], feet_pos[0]+10, feet_pos[1]], fill=BODY_CORE, width=8)
    
    hip_lift = phase * 65
    hip_x = base_x + 10
    hip_y = floor_y - 10 - hip_lift
    
    knee_x = base_x + 70
    knee_y = floor_y - 45 - int(phase * 15)
    
    draw.ellipse([head_pos[0]-14, head_pos[1]-14, head_pos[0]+14, head_pos[1]+14], fill=BODY_CORE)
    draw.line([shoulder_pos, (base_x - 10, floor_y - 4)], fill=BODY_LIMBS, width=7)
    draw.line([shoulder_pos, (hip_x, hip_y)], fill=BODY_CORE, width=18)
    draw.line([(hip_x, hip_y), (knee_x, knee_y)], fill=BODY_CORE, width=14)
    draw.line([(knee_x, knee_y), feet_pos], fill=BODY_LIMBS, width=10)
    
    return np.array(img)

# ══════════════════════════════════════════════════════════════════════════════
# 6. POWER CLEAN (Floor to Front-Rack Catch & Stand)
# ══════════════════════════════════════════════════════════════════════════════
def render_power_clean(frame_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    floor_y = int(HEIGHT * 0.78)
    draw_gym_background(draw, floor_y)
    
    phase = get_loop_phase(frame_idx, TOTAL_FRAMES)
    base_x = WIDTH // 2
    
    bar_y = floor_y - 25 - int(phase * 155)
    foot_l = (base_x - 30, floor_y)
    foot_r = (base_x + 30, floor_y)
    draw.line([foot_l[0]-10, foot_l[1], foot_l[0]+10, foot_l[1]], fill=BODY_CORE, width=6)
    draw.line([foot_r[0]-10, foot_r[1], foot_r[0]+10, foot_r[1]], fill=BODY_CORE, width=6)
    
    if phase < 0.5:
        hinge = (0.5 - phase) * 2.0
        hip_y = floor_y - 90 + int(hinge * 30)
        hip_x = base_x - int(hinge * 20)
        shoulder_y = hip_y - 65 + int(hinge * 20)
        shoulder_x = base_x + int(hinge * 10)
    else:
        stand = (phase - 0.5) * 2.0
        hip_y = floor_y - 110 - int(stand * 15)
        hip_x = base_x
        shoulder_y = hip_y - 75
        shoulder_x = base_x
    
    head_y = shoulder_y - 20
    knee_y = (floor_y + hip_y) // 2 + 10
    
    draw.line([foot_l, (base_x - 25, knee_y)], fill=BODY_LIMBS, width=8)
    draw.line([(base_x - 25, knee_y), (hip_x - 10, hip_y)], fill=BODY_CORE, width=10)
    draw.line([foot_r, (base_x + 25, knee_y)], fill=BODY_LIMBS, width=8)
    draw.line([(base_x + 25, knee_y), (hip_x + 10, hip_y)], fill=BODY_CORE, width=10)
    
    draw.line([(hip_x, hip_y), (shoulder_x, shoulder_y)], fill=BODY_CORE, width=16)
    draw.ellipse([shoulder_x - 12, head_y - 12, shoulder_x + 12, head_y + 12], fill=BODY_CORE)
    
    draw.line([base_x - 85, bar_y, base_x + 85, bar_y], fill=BAR_CHROME, width=5)
    draw.rectangle([base_x - 85, bar_y - 25, base_x - 75, bar_y + 25], fill=EQUIPMENT_YELLOW)
    draw.rectangle([base_x + 75, bar_y - 25, base_x + 85, bar_y + 25], fill=EQUIPMENT_YELLOW)
    
    if phase < 0.6:
        draw.line([(shoulder_x - 10, shoulder_y + 5), (base_x - 35, bar_y)], fill=BODY_LIMBS, width=7)
        draw.line([(shoulder_x + 10, shoulder_y + 5), (base_x + 35, bar_y)], fill=BODY_LIMBS, width=7)
    else:
        elbow_l = (base_x - 45, bar_y + 15)
        elbow_r = (base_x + 45, bar_y + 15)
        draw.line([(shoulder_x - 10, shoulder_y), elbow_l], fill=BODY_LIMBS, width=7)
        draw.line([elbow_l, (base_x - 30, bar_y)], fill=BODY_CORE, width=7)
        draw.line([(shoulder_x + 10, shoulder_y), elbow_r], fill=BODY_LIMBS, width=7)
        draw.line([elbow_r, (base_x + 30, bar_y)], fill=BODY_CORE, width=7)
        
    return np.array(img)

# ══════════════════════════════════════════════════════════════════════════════
# 7. CONVENTIONAL DEADLIFT (Floor to Lockout Pull)
# ══════════════════════════════════════════════════════════════════════════════
def render_conventional_deadlift(frame_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    floor_y = int(HEIGHT * 0.78)
    draw_gym_background(draw, floor_y)
    
    phase = get_loop_phase(frame_idx, TOTAL_FRAMES)
    base_x = WIDTH // 2
    
    bar_y = floor_y - 25 - int(phase * 85)
    hinge = (1.0 - phase) * 60
    rad = math.radians(hinge)
    
    feet = (base_x, floor_y)
    hips = (base_x - int((1.0 - phase) * 45), floor_y - 120 + int((1.0 - phase) * 35))
    knees = (base_x - int((1.0 - phase) * 20), floor_y - 60 + int((1.0 - phase) * 15))
    
    torso_len = 80
    shoulders = (hips[0] + int(torso_len * math.sin(rad)), hips[1] - int(torso_len * math.cos(rad)))
    head = (shoulders[0] + int(20 * math.sin(rad)), shoulders[1] - int(20 * math.cos(rad)))
    
    draw.line([feet, knees], fill=BODY_LIMBS, width=10)
    draw.line([knees, hips], fill=BODY_CORE, width=12)
    draw.line([hips, shoulders], fill=BODY_CORE, width=16)
    draw.ellipse([head[0]-12, head[1]-12, head[0]+12, head[1]+12], fill=BODY_CORE)
    
    draw.line([shoulders, (shoulders[0], bar_y)], fill=BODY_LIMBS, width=7)
    draw.line([shoulders[0] - 80, bar_y, shoulders[0] + 80, bar_y], fill=BAR_CHROME, width=5)
    draw.rectangle([shoulders[0] - 80, bar_y - 25, shoulders[0] - 70, bar_y + 25], fill=EQUIPMENT_YELLOW)
    draw.rectangle([shoulders[0] + 70, bar_y - 25, shoulders[0] + 80, bar_y + 25], fill=EQUIPMENT_YELLOW)
    
    return np.array(img)

# ══════════════════════════════════════════════════════════════════════════════
# 8. FLAT BARBELL BENCH PRESS (Flat Bench + Full Barbell)
# ══════════════════════════════════════════════════════════════════════════════
def render_flat_bench_press(frame_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    floor_y = int(HEIGHT * 0.78)
    draw_gym_background(draw, floor_y)
    
    phase = get_loop_phase(frame_idx, TOTAL_FRAMES)
    base_x = WIDTH // 2
    bench_y = floor_y - 65
    
    draw.rectangle([base_x - 110, bench_y, base_x + 110, bench_y + 12], fill=BENCH_COLOR)
    draw.rectangle([base_x - 80, bench_y + 12, base_x - 65, floor_y], fill=FRAME_DARK)
    draw.rectangle([base_x + 65, bench_y + 12, base_x + 80, floor_y], fill=FRAME_DARK)
    
    head_pos = (base_x - 70, bench_y - 12)
    hip_pos = (base_x + 55, bench_y - 6)
    chest_pos = ((head_pos[0] + hip_pos[0]) // 2, (head_pos[1] + hip_pos[1]) // 2)
    
    draw.ellipse([head_pos[0] - 12, head_pos[1] - 12, head_pos[0] + 12, head_pos[1] + 12], fill=BODY_CORE)
    draw.line([head_pos, hip_pos], fill=BODY_CORE, width=16)
    
    knee_pos = (hip_pos[0] + 30, bench_y + 10)
    foot_pos = (hip_pos[0] + 40, floor_y)
    draw.line([hip_pos, knee_pos], fill=BODY_LIMBS, width=8)
    draw.line([knee_pos, foot_pos], fill=BODY_LIMBS, width=8)
    
    bar_travel = (1.0 - phase) * 60
    bar_y = chest_pos[1] - 25 - bar_travel
    bar_x = chest_pos[0]
    
    elbow_y = min(bench_y + 15, bar_y + 35)
    elbow_x = bar_x - 20
    draw.line([chest_pos, (elbow_x, elbow_y)], fill=BODY_LIMBS, width=8)
    draw.line([(elbow_x, elbow_y), (bar_x, bar_y)], fill=BODY_LIMBS, width=7)
    
    draw.line([bar_x, bar_y - 70, bar_x, bar_y + 70], fill=BAR_CHROME, width=5)
    draw.rectangle([bar_x - 25, bar_y - 70, bar_x + 25, bar_y - 60], fill=EQUIPMENT_YELLOW)
    draw.rectangle([bar_x - 25, bar_y + 60, bar_x + 25, bar_y + 70], fill=EQUIPMENT_YELLOW)
    
    return np.array(img)

# ══════════════════════════════════════════════════════════════════════════════
# 9. BARBELL BACK SQUAT
# ══════════════════════════════════════════════════════════════════════════════
def render_barbell_squat(frame_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    floor_y = int(HEIGHT * 0.78)
    draw_gym_background(draw, floor_y)
    
    phase = get_loop_phase(frame_idx, TOTAL_FRAMES)
    depth = phase * 65
    base_x = WIDTH // 2
    
    foot_l = (base_x - 35, floor_y)
    foot_r = (base_x + 35, floor_y)
    draw.line([foot_l[0] - 10, foot_l[1], foot_l[0] + 10, foot_l[1]], fill=BODY_CORE, width=6)
    draw.line([foot_r[0] - 10, foot_r[1], foot_r[0] + 10, foot_r[1]], fill=BODY_CORE, width=6)
    
    hip_y = floor_y - 120 + depth
    hip_x = base_x - int(phase * 15)
    
    knee_l = (base_x - 45 - int(phase * 15), floor_y - 60 + int(depth * 0.5))
    knee_r = (base_x + 45 + int(phase * 15), floor_y - 60 + int(depth * 0.5))
    
    draw.line([foot_l, knee_l], fill=BODY_LIMBS, width=8)
    draw.line([knee_l, (hip_x - 15, hip_y)], fill=BODY_CORE, width=10)
    draw.line([foot_r, knee_r], fill=BODY_LIMBS, width=8)
    draw.line([knee_r, (hip_x + 15, hip_y)], fill=BODY_CORE, width=10)
    
    shoulder_y = hip_y - 75
    shoulder_x = hip_x + int(phase * 12)
    draw.line([(hip_x, hip_y), (shoulder_x, shoulder_y)], fill=BODY_CORE, width=16)
    
    head_y = shoulder_y - 20
    draw.ellipse([shoulder_x - 12, head_y - 12, shoulder_x + 12, head_y + 12], fill=BODY_CORE)
    
    bar_y = shoulder_y + 2
    draw.line([shoulder_x - 90, bar_y, shoulder_x + 90, bar_y], fill=BAR_CHROME, width=5)
    draw.rectangle([shoulder_x - 90, bar_y - 30, shoulder_x - 80, bar_y + 30], fill=EQUIPMENT_YELLOW)
    draw.rectangle([shoulder_x + 80, bar_y - 30, shoulder_x + 90, bar_y + 30], fill=EQUIPMENT_YELLOW)
    draw.line([(shoulder_x - 8, shoulder_y + 5), (shoulder_x - 45, bar_y)], fill=BODY_LIMBS, width=6)
    draw.line([(shoulder_x + 8, shoulder_y + 5), (shoulder_x + 45, bar_y)], fill=BODY_LIMBS, width=6)
    
    return np.array(img)

# ══════════════════════════════════════════════════════════════════════════════
# 10. GOBLET SQUAT (Vertical Dumbbell at Chest)
# ══════════════════════════════════════════════════════════════════════════════
def render_goblet_squat(frame_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    floor_y = int(HEIGHT * 0.78)
    draw_gym_background(draw, floor_y)
    
    phase = get_loop_phase(frame_idx, TOTAL_FRAMES)
    depth = phase * 65
    base_x = WIDTH // 2
    
    foot_l = (base_x - 35, floor_y)
    foot_r = (base_x + 35, floor_y)
    draw.line([foot_l[0] - 10, foot_l[1], foot_l[0] + 10, foot_l[1]], fill=BODY_CORE, width=6)
    draw.line([foot_r[0] - 10, foot_r[1], foot_r[0] + 10, foot_r[1]], fill=BODY_CORE, width=6)
    
    hip_y = floor_y - 120 + depth
    knee_l = (base_x - 45, floor_y - 60 + int(depth * 0.5))
    knee_r = (base_x + 45, floor_y - 60 + int(depth * 0.5))
    
    draw.line([foot_l, knee_l], fill=BODY_LIMBS, width=8)
    draw.line([knee_l, (base_x - 15, hip_y)], fill=BODY_CORE, width=10)
    draw.line([foot_r, knee_r], fill=BODY_LIMBS, width=8)
    draw.line([knee_r, (base_x + 15, hip_y)], fill=BODY_CORE, width=10)
    
    shoulder_y = hip_y - 75
    draw.line([(base_x, hip_y), (base_x, shoulder_y)], fill=BODY_CORE, width=16)
    draw.ellipse([base_x - 12, shoulder_y - 20 - 12, base_x + 12, shoulder_y - 20 + 12], fill=BODY_CORE)
    
    db_y = shoulder_y + 25
    draw.rectangle([base_x - 10, db_y - 15, base_x + 10, db_y + 15], fill=EQUIPMENT_YELLOW)
    draw.line([(base_x - 10, shoulder_y), (base_x, db_y)], fill=BODY_LIMBS, width=6)
    draw.line([(base_x + 10, shoulder_y), (base_x, db_y)], fill=BODY_LIMBS, width=6)
    
    return np.array(img)

# ══════════════════════════════════════════════════════════════════════════════
# 11. KETTLEBELL SWING (Pure Hip Hinge)
# ══════════════════════════════════════════════════════════════════════════════
def render_kettlebell_swing(frame_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    floor_y = int(HEIGHT * 0.78)
    draw_gym_background(draw, floor_y)
    
    phase = get_loop_phase(frame_idx, TOTAL_FRAMES)
    base_x = WIDTH // 2 - 30
    
    hinge_angle = (1.0 - phase) * 55
    feet = (base_x, floor_y)
    hips = (base_x - int((1.0 - phase) * 35), floor_y - 120 + int((1.0 - phase) * 15))
    
    torso_rad = math.radians(hinge_angle)
    shoulders = (hips[0] + int(80 * math.sin(torso_rad)), hips[1] - int(80 * math.cos(torso_rad)))
    head = (shoulders[0] + int(20 * math.sin(torso_rad)), shoulders[1] - int(20 * math.cos(torso_rad)))
    
    draw.line([feet, hips], fill=BODY_LIMBS, width=12)
    draw.line([hips, shoulders], fill=BODY_CORE, width=16)
    draw.ellipse([head[0]-12, head[1]-12, head[0]+12, head[1]+12], fill=BODY_CORE)
    
    arm_angle = math.radians(-30 + phase * 115)
    hand_x = shoulders[0] + int(60 * math.sin(arm_angle))
    hand_y = shoulders[1] + int(60 * math.cos(arm_angle))
    draw.line([shoulders, (hand_x, hand_y)], fill=BODY_LIMBS, width=7)
    
    kb_center = (hand_x + int(12 * math.sin(arm_angle)), hand_y + int(12 * math.cos(arm_angle)))
    draw.ellipse([kb_center[0]-14, kb_center[1]-14, kb_center[0]+14, kb_center[1]+14], fill=EQUIPMENT_YELLOW)
    draw.arc([hand_x-8, hand_y-8, hand_x+8, hand_y+8], start=0, end=180, fill=(180, 180, 180), width=3)
    
    return np.array(img)

# ══════════════════════════════════════════════════════════════════════════════
# SCRIPT EXECUTION
# ══════════════════════════════════════════════════════════════════════════════
def generate_video(filename, render_func):
    filepath = os.path.join(OUTPUT_DIR, filename)
    writer = imageio.get_writer(filepath, fps=FPS, codec="libx264", quality=8)
    for f in range(TOTAL_FRAMES):
        frame = render_func(f)
        writer.append_data(frame)
    writer.close()
    print(f"Generated {filename} ({os.path.getsize(filepath)} bytes)")

def main():
    # Explicit 1:1 Complete Mapping for Every Single Exercise
    mapping = {
        # 1. Incline Dumbbell Press (Inclined 35° bench + 2 distinct dumbbells)
        "incline-dumbbell-press.mp4": render_incline_dumbbell_press,
        "incline-press.mp4": render_incline_dumbbell_press,
        
        # 2. Pull-ups (Hanging bodyweight pull to fixed bar)
        "pull-up.mp4": render_pull_up,
        "pull-ups.mp4": render_pull_up,
        
        # 3. Lat Pulldown (Seated cable pulldown to chest)
        "lat-pulldown.mp4": render_lat_pulldown,
        
        # 4. Leg Press (45° reclined machine sled)
        "leg-press.mp4": render_leg_press,
        
        # 5. Glute Bridge (Supine floor hip bridge)
        "glute-bridge.mp4": render_glute_bridge,
        
        # 6. Power Clean (Floor to front-rack catch)
        "power-clean.mp4": render_power_clean,
        
        # 7. Deadlifts & Hinges
        "conventional-deadlift.mp4": render_conventional_deadlift,
        "romanian-deadlift.mp4": render_conventional_deadlift,
        "dumbbell-romanian-deadlift.mp4": render_conventional_deadlift,
        "kettlebell-swing.mp4": render_kettlebell_swing,
        "kettlebell-swings.mp4": render_kettlebell_swing,
        
        # 8. Chest & Presses
        "barbell-bench-press.mp4": render_flat_bench_press,
        "bench-press.mp4": render_flat_bench_press,
        
        # 9. Squats
        "barbell-back-squat.mp4": render_barbell_squat,
        "dumbbell-goblet-squat.mp4": render_goblet_squat,
        "goblet-squat.mp4": render_goblet_squat,
        "bodyweight-squat.mp4": render_goblet_squat,
        "resistance-band-squat.mp4": render_goblet_squat,
    }
    
    for filename, func in mapping.items():
        generate_video(filename, func)

if __name__ == "__main__":
    main()
