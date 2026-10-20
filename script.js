// 每件藏品都有独立的 ID、名称和初始问题。
const objects = {
  sphere: {
    title: "浑天仪",
    question: "如果地球始终受到太阳引力的吸引，为什么它不会直接落向太阳？试着用运动与引力解释轨道的形成。"
  },
  shell: {
    title: "螺旋贝壳",
    question: "如果一条螺线每转一圈，到中心的距离就变为原来的两倍，那么转三圈后，距离会是最初的多少倍？这种生长方式有什么特点？"
  },
  pendulum: {
    title: "黄铜摆锤",
    question: "在摆动角度很小时，把单摆的摆长增加到原来的四倍，它完成一次往返所需的时间会如何变化？你会怎样设计实验来检验？"
  }
};

const card = document.querySelector("#question-card");
const title = document.querySelector("#card-title");
const question = document.querySelector("#question");
const status = document.querySelector("#save-status");
let selectedId = null;

// 打开时优先读取保存值，没有保存值时显示初始问题。
document.querySelectorAll(".artifact").forEach((button) => {
  button.addEventListener("click", () => {
    selectedId = button.dataset.object;
    title.textContent = objects[selectedId].title;
    question.value = objects[selectedId].question;
    status.textContent = "修改后，点击保存以保留札记。";
    try {
      const saved = localStorage.getItem("cabinet-question-" + selectedId);
      if (saved !== null) question.value = saved;
    } catch {
      status.textContent = "浏览器无法读取本地存储。你仍可编辑，但可能无法保存。";
    }
    card.showModal();
  });
});

// localStorage 以字符串保存内容，刷新后仍可读取。
document.querySelector("#question-form").addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    localStorage.setItem("cabinet-question-" + selectedId, question.value);
    status.textContent = "札记已保存在此浏览器中。";
  } catch {
    status.textContent = "保存失败，请检查浏览器是否允许本地存储。";
  }
});

question.addEventListener("input", () => {
  status.textContent = "有尚未保存的修改。";
});

document.querySelector("#close-card").addEventListener("click", () => {
  card.close();
});
