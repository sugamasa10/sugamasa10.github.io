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
let w_arr = [];
let zc_arr = [];
let zc_ipc_arr = [];
let zc_hj_arr = [];
let w = Number(document.getElementById("w").value);
let h = Number(document.getElementById("h").value) / 1000;
let t = Number(document.getElementById("t").value) / 1000;
let er = Number(document.getElementById("er").value);

for (i = -20; i < 21; i++) {
  let w_tmp = Math.round((w + i / 1000) * 1000) / 1000;
  if (w_tmp < 0) {
    continue;
  } else {
    w_arr.push(w_tmp);
    w_tmp = w_tmp / 1000;
    zc_arr.push(calc_zc(w_tmp, h, t, er));
    zc_ipc_arr.push(calc_zc_ipc(w_tmp, h, t, er));
    zc_hj_arr.push(calc_zc_hj(w_tmp, h, t, er));
  }
}

let myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: w_arr,
    datasets: [
      {
        label: "konishi model",
        data: zc_arr,
        borderColor: color_pallet[0],
        backgroundColor: "rgba(0, 0, 0, 0)",
      },
      {
        label: "IPC model",
        data: zc_ipc_arr,
        borderColor: color_pallet[1],
        backgroundColor: "rgba(0, 0, 0, 0)",
      },
      {
        label: "Hammerstad and Jensen model",
        data: zc_hj_arr,
        borderColor: color_pallet[2],
        backgroundColor: "rgba(0, 0, 0, 0)",
      },
    ],
  },
  options: {
    responsive: false,
    title: {
      display: true,
      text: "characteristic impedance vs w",
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "characteristic impedance [ohms]",
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "w [mm]",
          },
        },
      ],
    },
  },
});

function calc_zc(w, h, t, er) {
  let eff =
    (er + 1) / 2 +
    (er - 1) / 2 / Math.sqrt(1 + (10 * h) / w) -
    (((er - 1) / 4.6) * (t / h)) / Math.sqrt(w / h);
  let dw =
    (t / Math.PI) *
    Math.log(
      (4 * Math.E) /
        Math.sqrt(
          Math.pow(t / h, 2) +
            1 / (Math.pow(Math.PI, 2) * Math.pow(w / t + 1.1, 2))
        )
    );
  let w0 = w + dw;
  let Z0 =
    30 *
    Math.log(
      1 +
        ((4 * h) / w0) *
          ((8 * h) / w0 +
            Math.sqrt(Math.pow((8 * h) / w0, 2) + Math.pow(Math.PI, 2)))
    );
  let Zc = Z0 / Math.sqrt(eff);
  return Zc;
}

function calc_zc_ipc(w, h, t, er) {
  let Z0 = (87 / Math.sqrt(er + 1.41)) * Math.log((6.98 * h) / (0.8 * w + t));
  return Z0;
}

function sinh(x) {
  return (Math.exp(x) - Math.exp(-x)) / 2;
}

function cosh(x) {
  return (Math.exp(x) + Math.exp(-x)) / 2;
}

function tanh(x) {
  return sinh(x) / cosh(x);
}

function coth(x) {
  return cosh(x) / sinh(x);
}

function calc_zc_hj(w, h, t, er) {
  let zf = 376.73031346177;
  // 導体厚補償
  let dw1 =
    (t / Math.PI) *
    Math.log(
      1 +
        (4 * Math.E) / ((t / h) * Math.pow(coth(Math.sqrt((6.517 * w) / h)), 2))
    );
  let dwr = (1 / 2) * dw1 * (1 + 1 / cosh(Math.sqrt(er - 1)));
  let w1 = w + dw1;
  let wr = w + dwr;

  // 誘電率補償
  let u = wr / h;
  let a =
    1 +
    (1 / 49) *
      Math.log(
        (Math.pow(u, 4) + Math.pow(u / 52, 2)) / (Math.pow(u, 4) + 0.432)
      ) +
    (1 / 18.7) * Math.log(1 + Math.pow(u / 18.1, 3));
  let b = 0.564 * Math.pow((er - 0.9) / (er + 3), 0.053);
  let eff =
    (er + 1) / 2 + ((er - 1) / 2) * Math.pow(1 + (10 * h) / wr, -1 * a * b);

  //
  let fu =
    6 + (2 * Math.PI - 6) * Math.exp(-1 * Math.pow((30.666 * h) / wr, 0.7528));
  let zl1 =
    (zf / (2 * Math.PI)) *
    Math.log((fu * h) / wr + Math.sqrt(1 + Math.pow((2 * h) / wr, 2)));
  let zl_hr = zl1 / Math.sqrt(eff);
  return zl_hr;
}

function disp_zc() {
  let w = Number(document.getElementById("w").value) / 1000;
  let h = Number(document.getElementById("h").value) / 1000;
  let t = Number(document.getElementById("t").value) / 1000;
  let er = Number(document.getElementById("er").value);
  let zc = calc_zc(w, h, t, er);
  let zc_ipc = calc_zc_ipc(w, h, t, er);
  let zc_hj = calc_zc_hj(w, h, t, er);
  document.getElementById("zc").value = Math.round(zc*100)/100;
  document.getElementById("zc_ipc").value = Math.round(zc_ipc*100)/100;
  document.getElementById("zc_hj").value = Math.round(zc_hj*100)/100;
}

function redraw() {
  let w_arr = [];
  let zc_arr = [];
  let zc_ipc_arr = [];
  let zc_hj_arr = [];
  let w = Number(document.getElementById("w").value);
  let h = Number(document.getElementById("h").value) / 1000;
  let t = Number(document.getElementById("t").value) / 1000;
  let er = Number(document.getElementById("er").value);
  for (i = -20; i < 21; i++) {
    let w_tmp = Math.round((w + i / 1000) * 1000) / 1000;
    if (w_tmp < 0) {
      continue;
    } else {
      w_arr.push(w_tmp);
      zc_arr.push(calc_zc(w_tmp / 1000, h, t, er));
      zc_ipc_arr.push(calc_zc_ipc(w_tmp / 1000, h, t, er));
      zc_hj_arr.push(calc_zc_hj(w_tmp / 1000, h, t, er));
    }
  }
  myChart.data.labels = w_arr;
  myChart.data.datasets.pop();
  myChart.data.datasets.pop();
  myChart.data.datasets.pop();
  myChart.data.datasets.push({
    label: "konishi model",
    data: zc_arr,
    borderColor: color_pallet[0],
    backgroundColor: "rgba(0, 0, 0, 0)",
  });
  myChart.data.datasets.push({
    label: "IPC model",
    data: zc_ipc_arr,
    borderColor: color_pallet[1],
    backgroundColor: "rgba(0, 0, 0, 0)",
  });
  myChart.data.datasets.push({
    label: "Hammerstad and Jensen model",
    data: zc_hj_arr,
    borderColor: color_pallet[2],
    backgroundColor: "rgba(0, 0, 0, 0)",
  });
  myChart.update(0);
}
disp_zc();
