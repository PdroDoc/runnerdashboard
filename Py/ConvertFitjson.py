import os
import json
from fitparse import FitFile

input_folder = "/Users/potz/Downloads/Garmins Files/RunFit"
output_folder = "/Users/potz/Downloads/Garmins Files/RunFit/json/"
os.makedirs(output_folder, exist_ok=True)

def extract_fit_data(fit_path):
    fitfile = FitFile(fit_path)
    summary = {
        "start_time": None,
        "duration_sec": 0,
        "distance_km": 0,
        "avg_heart_rate": 0,
        "calories": 0,
        "type": None,
        "laps": []
    }

    for record in fitfile.get_messages():
        if record.name == "session":
            for field in record:
                if field.name == "start_time":
                    summary["start_time"] = field.value.isoformat()
                elif field.name == "total_elapsed_time":
                    summary["duration_sec"] = round(field.value)
                elif field.name == "total_distance":
                    summary["distance_km"] = round(field.value / 1000, 2)
                elif field.name == "avg_heart_rate":
                    summary["avg_heart_rate"] = field.value
                elif field.name == "total_calories":
                    summary["calories"] = field.value
                elif field.name == "sport":
                    summary["type"] = field.value

        elif record.name == "lap":
            lap_data = {}
            for field in record:
                if field.name == "total_elapsed_time":
                    lap_data["duration"] = round(field.value)
                elif field.name == "total_distance":
                    lap_data["distance_km"] = round(field.value / 1000, 2)
                elif field.name == "avg_heart_rate":
                    lap_data["avg_hr"] = field.value
            summary["laps"].append(lap_data)

    return summary

# Processa todos os arquivos .fit da pasta
for filename in os.listdir(input_folder):
    if filename.endswith(".fit"):
        filepath = os.path.join(input_folder, filename)
        data = extract_fit_data(filepath)

        date_str = data["start_time"][:10] if data["start_time"] else filename.replace(".fit", "")
        json_path = os.path.join(output_folder, f"{date_str}.json")

        with open(json_path, "w") as f:
            json.dump(data, f, indent=2)

        print(f"✅ {filename} → {json_path}")