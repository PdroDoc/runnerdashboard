import pandas as pd
import json
from pathlib import Path
from datetime import datetime

# Caminhos
input_csv = Path("/Users/potz/Desktop/Runner/Run/csv/Activities.csv")  # ajuste nome se necessário
output_json = Path("/Users/potz/Desktop/runner-dashboard/public/Data/performance.json")

# Lê o CSV e trata dados
df = pd.read_csv(input_csv)
df["Distance"] = df["Distance"].astype(str).str.replace(",", ".").astype(float)
df["Avg HR"] = pd.to_numeric(df["Avg HR"], errors="coerce")

# Converte pace "5:12" em minutos decimais: 5 + 12/60 = 5.2
def pace_to_decimal(pace_str):
    if isinstance(pace_str, str) and ":" in pace_str:
        min_, sec = pace_str.split(":")
        return float(round(int(min_) + int(sec)/60, 2))
    return None

# Converte e ordena pela data, se necessário
df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
df = df.sort_values("Date").dropna(subset=["Date"])

# Pega os 10 mais recentes
latest = df.tail(10)

# Cria o JSON
data = {
    "paceData": [
        {"time": d.strftime("%Y-%m-%d"), "pace": pace_to_decimal(p)}
        for d, p in zip(latest["Date"], latest["Avg Pace"])
        if pace_to_decimal(p) is not None
    ],
    "heartRateData": [
        {"time": d.strftime("%Y-%m-%d"), "hr": int(hr) if pd.notna(hr) else None}
        for d, hr in zip(latest["Date"], latest["Avg HR"])
    ],
    "weeklyStats": [
        {"day": d.strftime("%a %d"), "distance": round(dist, 2)}
        for d, dist in zip(latest["Date"], latest["Distance"])
    ],
}

# Salva
output_json.parent.mkdir(parents=True, exist_ok=True)
with open(output_json, "w") as f:
    json.dump(data, f, indent=2)

print("✅ JSON atualizado com datas reais e pace corrigido")