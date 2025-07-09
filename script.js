async function fetchOdds() {
  try {
    const res = await fetch(`${BASE_API_URL}?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`);
    const data = await res.json();

    const topPicks = data.slice(0, 2);
    const dailyPickHTML = topPicks.map(game => {
      const { teams, bookmakers } = game;
      const odds = bookmakers[0].markets[0].outcomes;
      return `
        <strong>${teams[0]} vs ${teams[1]}</strong><br>
        ${odds.map(o => `${o.name}: ${o.price}`).join(' | ')}
      `;
    }).join('<br><br>');
    document.getElementById('daily-pick').innerHTML = dailyPickHTML;

    const accOdds = topPicks.map(g => g.bookmakers[0].markets[0].outcomes[0].price);
    const totalAcc = accOdds.reduce((a, b) => a * b, 1).toFixed(2);
    document.getElementById('accumulator').innerText = `Total Odds: ${totalAcc}`;
  } catch (err) {
    document.getElementById('daily-pick').innerText = 'Error loading odds.';
  }
}

function getPrediction() {
  const features = document.getElementById("features").value;
  const odds = document.getElementById("odds").value;

  const [f1, f2, f3] = features.split(',').map(Number);
  const prob = Math.min(0.98, (0.3 * f1 + 0.4 * f2 + 0.3 * f3) / 3);
  const implied = 1 / parseFloat(odds);
  const ev = (prob * odds - 1).toFixed(2);

  document.getElementById("prediction-result").innerText = `
  Model Prob: ${(prob * 100).toFixed(1)}%
  Implied Prob: ${(implied * 100).toFixed(1)}%
  Expected Value: ${ev}
  `;
}

fetchOdds();
