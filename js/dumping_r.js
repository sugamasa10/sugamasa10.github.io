let color_pallet = [
  "rgba(255,191,217,1)",
  "rgba(191,255,51,1)",
  "rgba(255,255,153,1)",
  "rgba(179,255,255,1)",
  "rgba(255,191,140,1)",
  "rgba(140,255,140,1)",
  "rgba(191,179,1,1)",
];
let ctx = document.getElementById("myChart");
ctx.width = 800;
// let context = ctx.getContext("2d");
// context.clearRect(0, 0, ctx.width, ctx.height);
let n = 40;
let { t, vd, vr } = calc(n);
for (let i = 0; i < t.length; i++) {
  t[i] = Math.round((t[i] / 2) * 10) / 10 + "τ";
}

let myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: t,
    datasets: [
      {
        label: "Driver",
        data: vd,
        borderColor: color_pallet[0],
        backgroundColor: "rgba(0, 0, 0, 0)",
        lineTension: 0,
      },
      {
        label: "Reciever",
        data: vr,
        borderColor: color_pallet[1],
        backgroundColor: "rgba(0, 0, 0, 0)",
        lineTension: 0,
      },
    ],
  },
  options: {
    responsive: false,
    title: {
      display: true,
      text: "voltage vs time",
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Voltage [V]",
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "time",
          },
        },
      ],
    },
  },
});

myChart.update(0);

function calc(n) {
  let t = Array(n)
    .fill()
    .map((_, i) => i);
  // フォームから読み出し
  let zs = Number(document.getElementById("zs").value);
  let rd = Number(document.getElementById("rd").value);
  let z0 = Number(document.getElementById("z0").value);
  let zt = Number(document.getElementById("zt").value);
  let v = Number(document.getElementById("v").value);
  // 初期値設定
  let rs = zs + rd;
  let r1 = (rs - z0) / (rs + z0) + 0.000001;
  let r2 = (zt - z0) / (zt + z0) + 0.000001;
  let vd = [];
  let vr = [];
  for (let i = 0; i < t.length; i++) {
    if (i == 0) {
      vd.push(0);
      vr.push(0);
    } else {
      let n1 = Math.floor(i / 2 - 0.5);
      let n2 = Math.ceil(i / 2 - 0.5);

      vd.push(
        ((v * zt) / (rs + zt)) *
          (1 - (((rs / zt) * (zt - z0)) / (rs + z0)) * Math.pow(r1 * r2, n1))
      );
      vr.push(((v * zt) / (rs + zt)) * (1 - Math.pow(r1 * r2, n2)));
    }
  }

  return { t, vd, vr };
}
function redraw() {
  let { t, vd, vr } = calc(n);
  myChart.data.datasets.pop();
  myChart.data.datasets.pop();
  myChart.data.datasets.push({
    label: "Driver",
    data: vd,
    borderColor: color_pallet[0],
    backgroundColor: "rgba(0, 0, 0, 0)",
    lineTension: 0,
  });
  myChart.data.datasets.push({
    label: "Reciever",
    data: vr,
    borderColor: color_pallet[1],
    backgroundColor: "rgba(0, 0, 0, 0)",
    lineTension: 0,
  });
  myChart.update(0);
}
