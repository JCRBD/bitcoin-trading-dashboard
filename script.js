async function fetchMarketData() {
  // Preu actual + variació CoinGecko API
  const url = 'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false';
  const res = await fetch(url);
  const data = await res.json();

  const price = data.market_data.current_price.usd;
  const change = data.market_data.price_change_percentage_24h;
  const volume = data.market_data.total_volume.usd;

  document.getElementById('marketData').innerHTML = `
    <ul>
      <li>Preu actual: <strong>$${price.toLocaleString()}</strong></li>
      <li>Volum 24h: <strong>$${volume.toLocaleString()}</strong></li>
      <li>Variació 24h: <strong>${change.toFixed(2)}%</strong></li>
    </ul>
  `;
}

async function fetchChartData() {
  // Preu històric últims 7 dies
  const url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7';
  const res = await fetch(url);
  const data = await res.json();

  // Formata dades per Chart.js
  const prices = data.prices.map(p => ({
    x: new Date(p[0]),
    y: p[1]
  }));

  drawChart(prices);
}

function drawChart(prices) {
  const ctx = document.getElementById('btcChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Preu BTC (USD)',
        data: prices,
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255,215,0,0.1)',
        pointRadius: 0,
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          },
          ticks: { color: '#FFD700' }
        },
        y: {
          ticks: { color: '#FFD700' }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#FFD700' }
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchMarketData();
  fetchChartData();
});