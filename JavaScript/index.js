"use strict";

// מערך דו-ממדי: כל שורה מייצגת איש קשר: [שם, טלפון, כתובת, גיל, תמונה, אמיל, טקסט חופשי]
const contacts = [
  ["Bertie Yates", "0501234567", "Tel Aviv", 28, "images/bertie.jpg", "bertie@example.com", "Best friend from college"],
  ["Hester Hogan", "0507654321", "Haifa", 34, "images/hester.jpg", "hester@example.com", "Loves hiking and coffee"],
  ["Larry Little", "0522223333", "Jerusalem", 40, "images/larry.jpg", "larry@example.com", "Works in finance"],
  ["Sean Walsh", "0539998888", "Eilat", 22, "images/sean.jpg", "sean@example.com", "Enjoys surfing and traveling"]
];

// קבלת רכיבים מהמסך
const contactsList = document.getElementById("contactsList");
const searchInput = document.getElementById("searchInput");
const peopleCount = document.getElementById("peopleCount");
const popup = document.getElementById("popup");
const popupDetails = document.getElementById("popupDetails");
const popupTitle = document.getElementById("popupTitle");
const closePopup = document.getElementById("closePopup");
const clearAllBtn = document.getElementById("clearAllBtn");
const addBtn = document.getElementById("addBtn");

// מציג את אנשי הקשר במסך
function renderList(list) {
  contactsList.innerHTML = "";//מתחיל הרשימה ריקה
  const messageElement = document.getElementById("noContactsMessage");//רכיב מהמסך מיצג הודעה שלא נמצא אנשי קשר ברשימה.

  if (list.length === 0) {
    peopleCount.textContent = "0 people";
    messageElement.textContent = "There are no contacts in the system.";
    return;
  } else {
    messageElement.textContent = ""; // מנקה הודעה קודמת
  }

  list.sort((a, b) => a[0].localeCompare(b[0])); // מיון לפי שם
  list.forEach((contact, index) => {
    const li = document.createElement("li");
    li.className = "contact";
    li.innerHTML = `
      <img src="${contact[4]}" alt="${contact[0]}">
      <span>${contact[0]}</span>
       <span>${contact[1]}</span>
      <div>
        <button data-action="info" data-index="${index}">
          <img src="images/icons8-info-128.png" alt="info" title="info" width="18" height="18">
        </button>
        <button data-action="edit" data-index="${index}">
          <img src="images/icons8-edit-64.png" alt="edit" title="edit" width="18" height="18">
        </button>
        <button data-action="delete" data-index="${index}">
          <img src="images/icons8-delete-100.png" alt="delete" title="delete" width="18" height="18">
        </button>
      </div>
    `;

    // ✅ הוספת אירועים לשינוי צבע רקע ב-hover
    //ברגע שסם העכבר על הרשימה משתנה הצבע
    li.addEventListener("mouseover", () => {
      li.classList.add("hovered");
    });
    li.addEventListener("mouseout", () => {
      li.classList.remove("hovered");
    });

    contactsList.appendChild(li);
  });
  peopleCount.textContent = `${contacts.length} people`;
}


// פותח חלון קופץ
function openPopup(title, contentHTML) {
  popupTitle.textContent = title;
  popupDetails.innerHTML = contentHTML;
  popup.classList.add("show");
}

// סוגר את החלון הקופץ
function closePopupFunc() {
  popup.classList.remove("show");
}

// לחיצה על כפתורי מידע/עריכה/מחיקה
contactsList.addEventListener("click", function (e) {
  const button = e.target.closest("button"); // מזהה את הכפתור גם אם לוחצים על ה-img
  if (!button) return;

  const action = button.dataset.action;
  const index = button.dataset.index;
  if (!action || index === undefined) return;

  const contact = contacts[index];

  if (action === "info") {
    let content = `
     <p><strong></strong><br> <img src="${contact[4]}" alt="Contact Image" width="100" height="100" ></p>
      <p><strong>Phone:</strong> ${contact[1]}</p>
      <p><strong>Address:</strong> ${contact[2]}</p>
      <p><strong>Age:</strong> ${contact[3]}</p>
      <p><strong>Email:</strong> ${contact[5]}</p>
      <p><strong>Text:</strong> ${contact[6]}</p>
    `;
    openPopup(contact[0], content);
  }

  if (action === "delete") {
    contacts.splice(index, 1);
    renderList(contacts);
  }

  if (action === "edit") {
    const form = `
    <form id="editForm">
      <input type="text" id="editName" value="${contact[0]}" required><br><br>
      <input type="text" id="editPhone" value="${contact[1]}" required><br><br>
      <input type="text" id="editAddress" value="${contact[2]}" placeholder="Address"><br><br>
      <input type="number" id="editAge" value="${contact[3]}" min="0" placeholder="Age"><br><br>
      <input type="email" id="editEmail" value="${contact[5]}" required><br><br>
      <textarea id="editText" required>${contact[6]}</textarea><br><br>

     
      <!-- תצוגה מקדימה של התמונה הקיימת -->
    ${contact[4] && contact[4].startsWith("data:")
        ? `<div style="text-align: center;">
       <img src="${contact[4]}" alt="Preview" 
            style="width: 80px; height: 80px; border-radius: 8px; margin-bottom: 15px;">
     </div>`
        : ""
      }

  
      <!-- כתובת תמונה (רק אם לא base64) -->
      <input type="text" id="editImage" value="${contact[4].startsWith('data:') ? '' : contact[4]}" placeholder="Image URL"><br><br>
  
      <!-- העלאת קובץ תמונה -->
      <input type="file" id="editImageFile" accept="image/*"><br><br>
  
      <button type="submit">Save</button>
    </form>
  `;

    openPopup("Edit Contact", form);

    document.getElementById("editForm").addEventListener("submit", function (ev) {
        // מונע ריענון דף בעת שליחת הטופס, כדי שנוכל לעדכן את הנתונים ב-JS בלבד

      ev.preventDefault();

      const name = document.getElementById("editName").value.trim();
      const phone = document.getElementById("editPhone").value.trim();
      const address = document.getElementById("editAddress").value.trim();
      const ageValue = document.getElementById("editAge").value.trim();
      const imageUrlInput = document.getElementById("editImage").value.trim();
      const fileInput = document.getElementById("editImageFile");
      const Email = document.getElementById("editEmail").value.trim();
      const Text = document.getElementById("editText").value.trim();

      const age = parseInt(ageValue, 10);

      // ✅ בדיקת גיל
      if (isNaN(age) || age < 0) {
        alert("Age must be a non-negative number.");
        return;
      }

      // פונקציה לבדוק אם מספר טלפון תקין (ישראלי)
      function isValidPhone(phone) {
        const cleaned = phone.replace(/[\s-]/g, ""); // מסיר רווחים ומקפים
        const regex = /^05\d{8}$/; // מתחיל ב-05 ואחריו 8 ספרות
        return regex.test(cleaned);
      }
      if (!isValidPhone(phone)) {
        alert("Phone number must start with 05 and be 10 digits long.");
        return;
      }

      // 🖼️ ברירת מחדל: שדה URL או התמונה הקיימת
      let image = imageUrlInput || contact[4];

      // אם הועלתה תמונה מקובץ – היא תקבל עדיפות
      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          image = e.target.result;
          finishEdit();
        };
        reader.readAsDataURL(fileInput.files[0]);
      } else {
        finishEdit();
      }

      function finishEdit() {
        contacts[index] = [name, phone, address, age, image, Email, Text];
        closePopupFunc();
        renderList(contacts);
      }
    });
  }

});

// פתיחת טופס הוספת איש קשר
//ה־required אומר לדפדפן:אל תאשר שליחה של הטופס בלי למלא את השדה.
addBtn.addEventListener("click", function () {
  const form = `
   <form id="addForm">
    <input type="text" id="addName" placeholder="Name" required><br><br>
    <input type="text" id="addPhone" placeholder="Phone" required><br><br>
    <input type="text" id="addAddress" placeholder="Address"><br><br>
    <input type="number" id="addAge" placeholder="Age" min="0"><br><br>
    <input type="email" id="addEmail" placeholder="Email"><br><br>
    <textarea type="text" id="addText" placeholder="text"></textarea><br><br>
    <input type="text" id="addImage" placeholder="Image URL"><br><br>
    <input type="file" id="addImageFile" accept="image/*"><br><br>
    <button type="submit">Save</button>
   </form>
  `;
  openPopup("Add Contact", form);

  document.getElementById("addForm").addEventListener("submit", function (ev) {
    ev.preventDefault();

    const name = document.getElementById("addName").value;
    const phone = document.getElementById("addPhone").value;
    const address = document.getElementById("addAddress").value;
    const age = document.getElementById("addAge").value;
    const Email = document.getElementById("addEmail").value;
    const Text = document.getElementById("addText").value;
    const imageUrlInput = document.getElementById("addImage").value.trim();
    const fileInput = document.getElementById("addImageFile");

    // 💥 בדיקות לפני הכל
    if (isNaN(age) || age < 0) {
      alert("Age must be a non-negative number.");
      return;
    }

    if (contacts.find(c => c[0].toLowerCase() === name.toLowerCase())) {
      alert("Name already exists!");
      return;
    }

    // פונקציה לבדוק אם מספר טלפון תקין (ישראלי)
    function isValidPhone(phone) {
      const cleaned = phone.replace(/[\s-]/g, ""); // מסיר רווחים ומקפים
      const regex = /^05\d{8}$/; // מתחיל ב-05 ואחריו 8 ספרות
      return regex.test(cleaned);
    }
    if (!isValidPhone(phone)) {
      alert("Phone number must start with 05 and be 10 digits long.");
      return;
    }

    let image = imageUrlInput || "images/default.jpg";

    // ⏳ אם נבחר קובץ – נטען אותו קודם
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        image = e.target.result;
        finishAdd();
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      finishAdd();
    }

    function finishAdd() {
      contacts.push([name, phone, address, age, image, Email, Text]);
      closePopupFunc();
      renderList(contacts);
    }
  });
});



// חיפוש אנשי קשר
searchInput.addEventListener("input", function () {
  const term = this.value.toLowerCase();
  const filtered = contacts.filter(c => c[0].toLowerCase().includes(term));
  renderList(filtered);
});

// ניקוי כל הרשימה
clearAllBtn.addEventListener("click", function () {
  if (confirm("Delete all contacts?")) {
    contacts.length = 0;
    renderList(contacts);
  }
});

//הפעלת האפקט
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("toggleEffectBtn");

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});




// סגירת חלון קופץ
closePopup.addEventListener("click", closePopupFunc);

// טען רשימה בהתחלה
renderList(contacts);
