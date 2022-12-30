// DOM元素
const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

// 彈出視窗
addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show"); // 加上show的class
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus(); // 預設title編輯中
});

// 關閉視窗
closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show"); // 移除show的class
    document.querySelector("body").style.overflow = "auto";
});

// 顯示所有便條
function showNotes(){
    if(!notes) return;
    document.querySelectorAll(".note").forEach(li => li.remove()); // 獲取所有class是note的元素並再添加新的便條前移除舊的
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag); // 在元素後插入節點
    });
}
showNotes();

// 功能菜單
function showMenu(elem){
    elem.parentElement.classList.add("show"); // 幫點三個點加上show的class
    // 當點擊菜單功能後移除show的class
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem){
            elem.parentElement.classList.remove("show");
        }
    });
}
// 刪除便條
function deleteNote(noteId){
    // 刪除提醒
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if(!confirmDel) return;

    notes.splice(noteId, 1); // 刪除
    localStorage.setItem("notes", JSON.stringify(notes)); // 更新存儲
    showNotes();
}
// 編輯便條
function updateNote(noteId, title, filterDesc){
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}


// 添加便條
addBtn.addEventListener("click", e => {
    e.preventDefault(); // 避免跳轉網頁

    let title = titleTag.value.trim(),
    description = descTag.value.trim();

    if(title || description){
        // 時間
        let currentDate = new Date(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();

        let noteInfo = {title, description, date: `${month} ${day}, ${year}`}
        // 新增
        if(!isUpdate){
            notes.push(noteInfo);
        }
        // 編輯
        else{
            isUpdate = false;
            notes[updateId] = noteInfo;
        }

        localStorage.setItem("notes", JSON.stringify(notes)); // 瀏覽器存儲
        showNotes();
        closeIcon.click();
    }

});