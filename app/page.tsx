"use client";

import { useState, useCallback } from "react";

type AltKey = "engineer" | "freelance" | "custom" | "saas";

type Alt = {
  name: string;
  cost: (m: number, d: number, t: number) => number;
  bar: "red" | "orange" | "blue" | "purple";
};

const presets = [
  { models: 4, days: 25, tjm: 400, alt: "engineer" as AltKey },
  { models: 8, days: 20, tjm: 550, alt: "engineer" as AltKey },
  { models: 6, days: 15, tjm: 600, alt: "freelance" as AltKey },
];

const alts: Record<AltKey, Alt> = {
  engineer: { name: "ML Engineer", cost: () => 78000, bar: "red" },
  freelance: { name: "Freelance ML", cost: (m, d, t) => m * d * t, bar: "orange" },
  custom: { name: "Pipeline maison", cost: (m, _d, t) => 60 * t + m * 5 * t, bar: "blue" },
  saas: { name: "SaaS enterprise", cost: () => 36000, bar: "purple" },
};

function fmt(n: number) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function Home() {
  const [seg, setSeg] = useState(0);
  const [models, setModels] = useState(4);
  const [days, setDays] = useState(20);
  const [tjm, setTjm] = useState(500);
  const [server, setServer] = useState(100);
  const [alt, setAlt] = useState<AltKey>("engineer");

  const setSegment = useCallback((i: number) => {
    setSeg(i);
    const p = presets[i];
    setModels(p.models);
    setDays(p.days);
    setTjm(p.tjm);
    setAlt(p.alt);
  }, []);

  const maiker = (200 + server) * 12;
  const maikerDays = models * 3;
  const a = alts[alt];
  const altCost = a.cost(models, days, tjm);
  const savedRaw = altCost - maiker;
  const saved = savedRaw < 0 ? 0 : savedRaw;
  const pct = altCost > 0 ? Math.round((saved / altCost) * 100) : 0;
  const roi = maiker > 0 ? saved / maiker : 0;
  const daysSavedRaw = models * days - maikerDays;
  const daysSaved = daysSavedRaw < 0 ? 0 : daysSavedRaw;
  const payback = saved > 0 ? Math.round((maiker / saved) * 365) : 999;

  const mx = Math.max(maiker, altCost);
  const maikerBarWidth = Math.max((maiker / mx) * 100, 6);
  const altBarWidth = Math.max((altCost / mx) * 100, 6);

  const roiText = roi >= 1 ? "x" + Math.round(roi) : Math.round(roi * 100) + "%";
  const paybackText = payback < 365 ? payback + "j" : ">1 an";

  return (
    <>
      <div className="header">
        <div className="logo">
          m<span className="ai">AI</span>ker
        </div>
        <h1>Calculez votre retour sur investissement.</h1>
        <p>Comparez le cout de mAIker avec les alternatives et visualisez vos economies.</p>
      </div>

      <div className="container">
        {/* LEFT PANEL */}
        <div className="card">
          <div className="card-label">Votre situation</div>

          <div className="segments">
            <button
              className={"seg-btn" + (seg === 0 ? " active" : "")}
              onClick={() => setSegment(0)}
            >
              Data Analyst
              <br />
              PME
            </button>
            <button
              className={"seg-btn" + (seg === 1 ? " active" : "")}
              onClick={() => setSegment(1)}
            >
              Head of Data
              <br />
              Startup
            </button>
            <button
              className={"seg-btn" + (seg === 2 ? " active" : "")}
              onClick={() => setSegment(2)}
            >
              Consultant
              <br />
              Data / ESN
            </button>
          </div>

          <div className="field">
            <div className="field-label">
              <span>Modeles ML par an</span>
              <div className="field-value">
                {models} <span className="unit">modeles</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={models}
              onChange={(e) => setModels(+e.target.value)}
            />
            <div className="range-labels">
              <span>1</span>
              <span>10</span>
              <span>20</span>
            </div>
          </div>

          <div className="field">
            <div className="field-label">
              <span>Jours par modele (aujourd&apos;hui)</span>
              <div className="field-value">
                {days} <span className="unit">jours</span>
              </div>
            </div>
            <input
              type="range"
              min={3}
              max={60}
              value={days}
              onChange={(e) => setDays(+e.target.value)}
            />
            <div className="range-labels">
              <span>3j</span>
              <span>30j</span>
              <span>60j</span>
            </div>
          </div>

          <div className="field">
            <div className="field-label">
              <span>Cout journalier data / ML</span>
              <div className="field-value">
                {fmt(tjm)} <span className="unit">euros/j</span>
              </div>
            </div>
            <input
              type="range"
              min={200}
              max={1200}
              step={50}
              value={tjm}
              onChange={(e) => setTjm(+e.target.value)}
            />
            <div className="range-labels">
              <span>200</span>
              <span>700</span>
              <span>1 200</span>
            </div>
          </div>

          <div className="field">
            <div className="field-label">
              <span>Alternative comparee</span>
            </div>
            <select value={alt} onChange={(e) => setAlt(e.target.value as AltKey)}>
              <option value="engineer">Recruter un ML Engineer</option>
              <option value="freelance">Freelance / prestataire</option>
              <option value="custom">Pipeline MLOps maison</option>
              <option value="saas">SaaS enterprise (DataRobot...)</option>
            </select>
          </div>

          <div className="field">
            <div className="field-label">
              <span>Serveur mAIker</span>
              <div className="field-value">
                {fmt(server)} <span className="unit">euros/mois</span>
              </div>
            </div>
            <input
              type="range"
              min={34}
              max={700}
              step={10}
              value={server}
              onChange={(e) => setServer(+e.target.value)}
            />
            <div className="range-labels">
              <span>34</span>
              <span>350</span>
              <span>700</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="results">
          <div className="hero-metric">
            <div className="label">Economie annuelle</div>
            <div className="amount">{fmt(saved)} euros</div>
            <div className="sub">soit {pct}% de reduction vs l&apos;alternative</div>
          </div>

          <div className="metric-row">
            <div className="metric">
              <div className="val blue">{roiText}</div>
              <div className="lbl">ROI</div>
            </div>
            <div className="metric">
              <div className="val cyan">{daysSaved}j</div>
              <div className="lbl">Jours gagnes / an</div>
            </div>
            <div className="metric">
              <div className="val green">{paybackText}</div>
              <div className="lbl">Rentabilisation</div>
            </div>
          </div>

          <div className="card chart">
            <div className="chart-title">Cout annuel compare</div>
            <div>
              <div className="bar-row">
                <div className="bar-name">mAIker</div>
                <div className="bar-track">
                  <div className="bar-fill green" style={{ width: maikerBarWidth + "%" }} />
                  <div className="bar-cost">{fmt(maiker)} euros/an</div>
                </div>
              </div>
              <div className="bar-row">
                <div className="bar-name">{a.name}</div>
                <div className="bar-track">
                  <div
                    className={"bar-fill " + a.bar}
                    style={{ width: altBarWidth + "%" }}
                  />
                  <div className="bar-cost">{fmt(altCost)} euros/an</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-label">Detail</div>
            <div>
              <div className="detail-row">
                <div className="dt">Licence mAIker</div>
                <div className="dd">200 euros/mois</div>
              </div>
              <div className="detail-row">
                <div className="dt">Serveur</div>
                <div className="dd">{fmt(server)} euros/mois</div>
              </div>
              <div className="detail-row">
                <div className="dt">Cout total mAIker</div>
                <div className="dd green">{fmt(maiker)} euros/an</div>
              </div>
              <div className="detail-row">
                <div className="dt">Cout {a.name.toLowerCase()}</div>
                <div className="dd red">{fmt(altCost)} euros/an</div>
              </div>
              <div className="detail-row">
                <div className="dt">Temps mAIker par modele</div>
                <div className="dd">~3 jours</div>
              </div>
              <div className="detail-row">
                <div className="dt">Temps actuel par modele</div>
                <div className="dd">{days} jours</div>
              </div>
              <div className="detail-row">
                <div className="dt">Jours liberes par an</div>
                <div className="dd green">{daysSaved} jours</div>
              </div>
            </div>
          </div>

          <div className="cta-wrap">
            <a
              href="https://www.cania.fr/products/maiker"
              target="_blank"
              rel="noopener noreferrer"
              className="cta"
            >
              Decouvrir mAIker
            </a>
          </div>
        </div>
      </div>

      <div className="footer">
        Simulateur construit par{" "}
        <a href="https://acceleria.co" target="_blank" rel="noopener noreferrer">
          AcceleriA
        </a>{" "}
        pour{" "}
        <a href="https://www.cania.fr" target="_blank" rel="noopener noreferrer">
          canIA
        </a>
        <br />
        Les estimations sont indicatives.
      </div>
    </>
  );
}
