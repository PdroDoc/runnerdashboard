import tkinter as tk
from tkinter import ttk
import json
from pathlib import Path

# Configurações dos campos
DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
TYPES = ["Easy Run", "Interval", "Tempo Run", "Long Run", "Recovery", "Rest"]
DISTANCES = ["-", "3K", "4K", "5K", "6K", "8K", "10K", "15K", "21K"]
DURATIONS = ["-", "15:00", "20:00", "25:00", "30:00", "35:00", "45:00", "60:00", "75:00"]

# Caminho onde o JSON será salvo
output_path = Path("/Users/potz/Desktop/runner-dashboard/public/Data/weekly-plan.json")

# Função para salvar o plano no JSON
def save_plan():
    plan = []
    for row in rows:
        plan.append({
            "day": row["day"].get(),
            "type": row["type"].get(),
            "distance": row["distance"].get(),
            "duration": row["duration"].get(),
            "completed": row["completed"].get() == "Yes"
        })
    with open(output_path, "w") as f:
        json.dump(plan, f, indent=2)
    status_label.config(text="✅ Plano salvo com sucesso!")

# Criação da interface
root = tk.Tk()
root.title("Planejar Semana de Corrida")

rows = []

# Cabeçalhos
tk.Label(root, text="Dia").grid(row=0, column=0)
tk.Label(root, text="Tipo").grid(row=0, column=1)
tk.Label(root, text="Distância").grid(row=0, column=2)
tk.Label(root, text="Duração").grid(row=0, column=3)
tk.Label(root, text="Concluído").grid(row=0, column=4)

# Linhas para cada dia
for i, day in enumerate(DAYS):
    day_var = tk.StringVar(value=day)
    type_var = tk.StringVar()
    dist_var = tk.StringVar()
    dur_var = tk.StringVar()
    comp_var = tk.StringVar(value="No")

    tk.Label(root, text=day).grid(row=i+1, column=0)
    ttk.Combobox(root, textvariable=type_var, values=TYPES, width=12).grid(row=i+1, column=1)
    ttk.Combobox(root, textvariable=dist_var, values=DISTANCES, width=6).grid(row=i+1, column=2)
    ttk.Combobox(root, textvariable=dur_var, values=DURATIONS, width=8).grid(row=i+1, column=3)
    ttk.Combobox(root, textvariable=comp_var, values=["No", "Yes"], width=5).grid(row=i+1, column=4)

    rows.append({
        "day": day_var,
        "type": type_var,
        "distance": dist_var,
        "duration": dur_var,
        "completed": comp_var
    })

# Botão de salvar
tk.Button(root, text="Salvar Plano", command=save_plan).grid(row=8, column=0, columnspan=5, pady=10)
status_label = tk.Label(root, text="")
status_label.grid(row=9, column=0, columnspan=5)

root.mainloop()