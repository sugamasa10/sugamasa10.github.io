let color_pallet = [
  "rgba(255,191,217,1)",
  "rgba(255,255,153,1)",
  "rgba(191,255,51,1)",
  "rgba(179,255,255,1)",
  "rgba(255,191,140,1)",
  "rgba(140,255,140,1)",
  "rgba(191,179,1,1)",
];
let ctx = document.getElementById("myChart");
ctx.width = 800;
// let context = ctx.getContext("2d");
// context.clearRect(0, 0, ctx.width, ctx.height);
let x = Array(36)
  .fill()
  .map((_, i) => i);
// フォームから読み出し
let temp_out = document.getElementById("out_temp").value;
let UA1 = document.getElementById("ua1").value;
// 初期値設定
let A = 6.116441;
let m = 7.591386;
let Tn = 240.7263;
let UA2 = 8.6;
let RH = [30, 40, 45, 50, 55, 60, 70];
let y = [];
for (let i = 0; i < RH.length; i++) {
  y.push([]);
}
let temp_sur = [];
for (let i = 0; i < x.length; i++) {
  temp_sur.push(x[i] - (UA1 / UA2) * (x[i] - temp_out));
}

for (let i = 0; i < RH.length; i++) {
  for (let j = 0; j < x.length; j++) {
    let Pw = (A * Math.pow(10, (m * x[j]) / (x[j] + Tn)) * RH[i]) / 100;
    y[i].push(Tn / (m / Math.log10(Pw / A) - 1));
  }
}

let myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: x,
  },
  options: {
    responsive: false,
    title: {
      display: true,
      text: "window temp, dew point vs room temp",
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "window temp, dew point [deg C]",
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "room temperature [deg C]",
          },
        },
      ],
    },
  },
});

for (let i = 0; i < RH.length; i++) {
  myChart.data.datasets.push({
    label: RH[i] + "%RH",
    data: y[i],
    borderColor: color_pallet[i],
    backgroundColor: "rgba(0, 0, 0, 0)",
  });
}
myChart.data.datasets.push({
  label: "window temp",
  data: temp_sur,
  borderColor: "rgba(0, 0, 0, 0.5)",
  backgroundColor: "rgba(0, 0, 0, 0)",
});
myChart.update(0);

function redraw() {
  ctx = document.getElementById("myChart");
  temp_out = document.getElementById("out_temp").value;
  UA1 = document.getElementById("ua1").value;
  temp_sur = [];
  for (let i = 0; i < x.length; i++) {
    temp_sur.push(x[i] - (UA1 / UA2) * (x[i] - temp_out));
  }
  myChart.data.datasets.pop();
  myChart.data.datasets.push({
    label: "window temp",
    data: temp_sur,
    borderColor: "rgba(0, 0, 0, 0.5)",
    backgroundColor: "rgba(0, 0, 0, 0)",
  });
  myChart.update(0);
}
