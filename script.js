function 保存する(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("weeks", JSON.stringify(weeks))
}

function 読み込む() {
  let 保存されたデータ1 = localStorage.getItem("tasks");
  let 保存されたデータ2 = localStorage.getItem("weeks");
  if (保存されたデータ1 !== null) {
    tasks = JSON.parse(保存されたデータ1);
  }
  
  if(保存されたデータ2 !== null){
    weeks = JSON.parse(保存されたデータ2);
  }
}


let weeks = [
  { 週のID: 1, 開始日: "2026/8/4", 終了日: "2026/8/10", 今週の目標: "アプリの枠組みを作る", 振り返り: "" },
  { 週のID: 2, 開始日: "2026/8/11", 終了日: "2026/8/17", 今週の目標: "CSSを整える", 振り返り: "" }
];

let 現在の週ID = 1;

function 新しいIDを作る(配列) {
  let 最大のID = 0;
  for (let i = 0; i < 配列.length; i++) {
    if (配列[i].週のID > 最大のID) {
      最大のID = 配列[i].週のID;
    }
  }
  return 最大のID + 1;
}

function 現在の週を取得する() {
  for (let i = 0; i < weeks.length; i++) {
    if (weeks[i].週のID == 現在の週ID) {
      return weeks[i];
    }
  }
}

let tasks = [];

読み込む()

function 最新の週を取得する() {
  let 最新の週 = weeks[0];
  for (let i = 0; i < weeks.length; i++) {
    if (weeks[i].週のID > 最新の週.週のID) {
      最新の週 = weeks[i];
    }
  }
  return 最新の週;
}

function 新しい週の日付を計算する() {
  let 最新の週 = 最新の週を取得する();
  let 前回の終了日 = new Date(最新の週.終了日);

  let 新しい開始日 = new Date(前回の終了日);
  新しい開始日.setDate(前回の終了日.getDate() + 1);

  let 新しい終了日 = new Date(新しい開始日);
  新しい終了日.setDate(新しい開始日.getDate() + 6);

  return {
    開始日: 日付を文字列にする(新しい開始日),
    終了日: 日付を文字列にする(新しい終了日)
  };
}

function 日付を文字列にする(dateObj) {
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;  // 注意:月は0始まり(1月=0)なので+1する
  let day = dateObj.getDate();
  return year + "/" + month + "/" + day;
}
weeks.splice(2, 1);

let addWeekButton = document.getElementById("add-week-button");

addWeekButton.addEventListener("click", function() {
  let goalInput = document.getElementById("new-week-goal");

  if (goalInput.value != "") {
    let 新しい日付 = 新しい週の日付を計算する();

    let newWeek = {
      週のID: 新しいIDを作る(weeks),
      開始日: 新しい日付.開始日,
      終了日: 新しい日付.終了日,
      今週の目標: goalInput.value,
      振り返り: ""
    };

    weeks.push(newWeek);
    現在の週ID = newWeek.週のID;

    goalInput.value = "";

    保存する();
    週を表示する();
    画面を更新する();
    週選択肢を表示する();
    チェックボックスにイベントをつける();
    反省入力欄にイベントをつける();
  } else {
    alert("目標を入力してください");
  }
});

function 反省入力欄にイベントをつける() {
  let reflectionInputs = document.querySelectorAll(".reflection-input");

  for (let i = 0; i < reflectionInputs.length; i++) {
    reflectionInputs[i].addEventListener("input", function() {
      let editedId = this.dataset.id;
      let newValue = this.value;

      for (let j = 0; j < tasks.length; j++) {
        if (tasks[j].タスクのID == editedId) {
          tasks[j].このタスクの反省 = newValue;
        }
      }

      保存する();
    });
  }
}

function 週を表示する(){
  let weekSection = document.getElementById("week-section");
  let 現在の週 = 現在の週を取得する();
  weekSection.innerHTML = "今週の目標 : " + 現在の週.今週の目標;
}

function 週選択肢を表示する() {
  let weekSelector = document.getElementById("week-selector");
  let html = "";

  for (let i = 0; i < weeks.length; i++) {
    html = html + "<option value='" + weeks[i].週のID + "'>" + weeks[i].開始日 + "〜" + weeks[i].終了日 + "</option>";
  }

  weekSelector.innerHTML = html;
  weekSelector.value = 現在の週ID;
}

function 週選択にイベントをつける() {
  let weekSelector = document.getElementById("week-selector");

  weekSelector.addEventListener("change", function() {
    現在の週ID = this.value;
    週を表示する();
    画面を更新する();
    チェックボックスにイベントをつける();
    反省入力欄にイベントをつける();
  });
}

let saveReflectionButton = document.getElementById("save-reflection-button");

saveReflectionButton.addEventListener("click", function() {
  let inputElement = document.getElementById("week-reflection-input");
  let inputValue = inputElement.value;

  let 現在の週 = 現在の週を取得する();
  現在の週.振り返り = inputValue;

  保存する();
});

function 画面を更新する(){
    let taskSection = document.getElementById("task-section");
    let html = "";

    for(let i = 0; i < tasks.length; i++){
      if(tasks[i].週のID != 現在の週ID){
        continue;
      }
        let checkedText = "";
        let completedClass = "";
        if (tasks[i].終わったか == true) {
          checkedText = "checked";
          completedClass = "completed";
        }

        html = html + "<div class='task-card " + completedClass + "'>";
        html = html + "<label class='task-label'>";
        html = html + "<input type='checkbox' data-id='" + tasks[i].タスクのID + "' " + checkedText + ">";
        html = html + "<span>" + tasks[i].タスクの内容 + "</span>";
        html = html + "</label>";
        html = html + "<input type='text' class='reflection-input' data-id='" + tasks[i].タスクのID + "' value='" + tasks[i].このタスクの反省 + "' placeholder='反省を書く'><br>";
        html = html + "</div>";
    }
    taskSection.innerHTML = html;

    let weekReflection = document.getElementById("week-reflection-input");
    let 現在の週 = 現在の週を取得する();
    let Html = 現在の週.振り返り; 

    weekReflection.innerHTML = Html;
}

function チェックボックスにイベントをつける() {
  let checkboxes = document.querySelectorAll("input[type='checkbox']");

  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("click", function() {
      let clickedId = this.dataset.id;

      for(let j = 0; j < tasks.length; j++){
        if(tasks[j].タスクのID == clickedId){
            tasks[j].終わったか = !tasks[j].終わったか
        }
      }
      画面を更新する();
      保存する();
      チェックボックスにイベントをつける();
      反省入力欄にイベントをつける();
    });
  }
}

週を表示する();
画面を更新する();
保存する();
チェックボックスにイベントをつける();
反省入力欄にイベントをつける();
週選択肢を表示する();
週選択にイベントをつける();

let addTaskButton = document.getElementById("add-task-button");

addTaskButton.addEventListener("click", function() {
  let inputElement = document.getElementById("new-task-input");
  let inputValue = inputElement.value;  // 入力された文字を取得

  let newTask = {
    タスクのID: tasks.length + 1,
    週のID: 現在の週ID,
    実施日: "",
    タスクの内容: inputValue,
    終わったか: false,
    このタスクの反省: ""
  };

  tasks.push(newTask);  // 配列の最後に追加

  inputElement.value = "";  // 入力欄を空にする

  画面を更新する();
  保存する();
  チェックボックスにイベントをつける();
  反省入力欄にイベントをつける();
});