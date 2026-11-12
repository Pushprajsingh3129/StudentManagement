
let currentRole = "admin";
let currentUser = null;

function getData(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

let students = getData("edu_students");
let attendance = getData("edu_attendance");
let results = getData("edu_results");
let fees = getData("edu_fees");
let notices = getData("edu_notices");

function menu() {
    const nav = document.getElementById("nav");

    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
    nav.style.flexDirection = "column";
    nav.style.position = "absolute";
    nav.style.top = "76px";
    nav.style.left = "0";
    nav.style.width = "100%";
    nav.style.padding = "20px";
    nav.style.background = "white";
}

function openLogin(role) {
    currentRole = role;
    document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

function setRole(role) {
    currentRole = role;
}

function showDashboard(role) {
    closeLogin();

    document.querySelectorAll(
        "header, .hero, .statistics, .section, .about, .portals, .notices, .contact, footer, .copyright"
    ).forEach(el => el.style.display = "none");

    document.getElementById("adminDashboard").style.display =
        role === "admin" ? "grid" : "none";

    document.getElementById("studentDashboard").style.display =
        role === "student" ? "block" : "none";

    if (role === "admin") {
        showPanel("overview");
        updateDashboard();
    } else {
        updateStudentPortal();
    }
}

function logout() {
    currentUser = null;

    document.getElementById("adminDashboard").style.display = "none";
    document.getElementById("studentDashboard").style.display = "none";

    document.querySelectorAll(
        "header, .hero, .statistics, .section, .about, .portals, .notices, .contact, footer, .copyright"
    ).forEach(el => el.style.display = "");

    window.scrollTo(0, 0);
}

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const error = document.getElementById("loginError");

    if (
        currentRole === "admin" &&
        email === "admin@edumanage.com" &&
        password === "Admin@123"
    ) {
        currentUser = {role:"admin", email};
        showDashboard("admin");
        return;
    }

    if (
        currentRole === "student" &&
        email === "student@edumanage.com" &&
        password === "Student@123"
    ) {
        currentUser = {
            role:"student",
            email,
            name:"Demo Student"
        };
        showDashboard("student");
        return;
    }

    error.textContent = "Invalid Email or Password";
});

function showPanel(id) {
    document.querySelectorAll(".admin-panel").forEach(panel => {
        panel.hidden = true;
    });

    document.getElementById(id).hidden = false;

    if (id === "students") renderStudents();
    if (id === "attendance") renderAttendance();
    if (id === "results") renderResults();
    if (id === "fees") renderFees();
    if (id === "notices") renderNotices();
}

function updateDashboard() {
    document.getElementById("totalStudents").textContent = students.length;
    document.getElementById("totalPresent").textContent =
        attendance.filter(a => a.status === "Present").length;
    document.getElementById("totalResults").textContent = results.length;
    document.getElementById("totalFees").textContent = fees.length;
}

function studentFormSubmit(e) {
    e.preventDefault();

    const student = {
        id: Date.now(),
        name: document.getElementById("studentName").value.trim(),
        email: document.getElementById("studentEmail").value.trim(),
        course: document.getElementById("studentCourse").value.trim()
    };

    if (students.some(s => s.email.toLowerCase() === student.email.toLowerCase())) {
        alert("Email already registered");
        return;
    }

    students.push(student);
    saveData("edu_students", students);
    this.reset();
    renderStudents();
    updateDashboard();
}

document.getElementById("studentForm").addEventListener("submit", studentFormSubmit);

function safe(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function renderStudents() {
    document.getElementById("studentList").innerHTML =
        students.map(s => `
        <div>
            <b>${safe(s.name)}</b> |
            ${safe(s.email)} |
            ${safe(s.course)}
            <button onclick="deleteStudent(${s.id})">Delete</button>
        </div>
    `).join("") || "No Students Found";
}

function deleteStudent(id) {
    if (!confirm("Delete student?")) return;

    students = students.filter(s => s.id !== id);
    saveData("edu_students", students);
    renderStudents();
    updateDashboard();
}

function renderAttendance() {
    document.getElementById("attendanceList").innerHTML =
        students.map(s => `
        <div>
            ${safe(s.name)}
            <button onclick="markAttendance(${s.id},'Present')">Present</button>
            <button onclick="markAttendance(${s.id},'Absent')">Absent</button>
        </div>
    `).join("") || "Add students first";
}

function markAttendance(id, status) {
    const today = new Date().toLocaleDateString();

    attendance = attendance.filter(a =>
        !(a.studentId === id && a.date === today)
    );

    attendance.push({studentId:id, status, date:today});

    saveData("edu_attendance", attendance);
    updateDashboard();
    alert("Attendance Saved");
}

document.getElementById("resultForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const marks = Number(document.getElementById("resultMarks").value);

    if (marks < 0 || marks > 100) {
        alert("Enter marks between 0 and 100");
        return;
    }

    results.push({
        name:document.getElementById("resultName").value.trim(),
        marks,
        grade:marks >= 90 ? "A+" : marks >= 75 ? "A" :
              marks >= 60 ? "B" : marks >= 40 ? "C" : "Fail"
    });

    saveData("edu_results", results);
    this.reset();
    renderResults();
    updateDashboard();
});

function renderResults() {
    document.getElementById("resultList").innerHTML =
        results.map(r => `<div>${safe(r.name)} - ${r.marks}/100 - ${r.grade}</div>`).join("")
        || "No Results";
}

document.getElementById("feeForm").addEventListener("submit", function(e) {
    e.preventDefault();

    fees.push({
        name:document.getElementById("feeName").value.trim(),
        amount:Number(document.getElementById("feeAmount").value),
        status:document.getElementById("feeStatus").value
    });

    saveData("edu_fees", fees);
    this.reset();
    renderFees();
    updateDashboard();
});

function renderFees() {
    document.getElementById("feeList").innerHTML =
        fees.map(f => `<div>${safe(f.name)} - ₹${f.amount} - ${safe(f.status)}</div>`).join("")
        || "No Fee Records";
}

document.getElementById("noticeForm").addEventListener("submit", function(e) {
    e.preventDefault();

    notices.push({
        id:Date.now(),
        title:document.getElementById("noticeTitle").value.trim(),
        date:new Date().toLocaleDateString()
    });

    saveData("edu_notices", notices);
    this.reset();
    renderNotices();
});

function renderNotices() {
    document.getElementById("noticeList").innerHTML =
        notices.map(n => `
        <div>
            ${safe(n.title)} - ${safe(n.date)}
            <button onclick="deleteNotice(${n.id})">Delete</button>
        </div>
    `).join("") || "No Notices";
}

function deleteNotice(id) {
    notices = notices.filter(n => n.id !== id);
    saveData("edu_notices", notices);
    renderNotices();
}

function updateStudentPortal() {
    document.getElementById("studentWelcome").textContent =
        currentUser.name;

    document.getElementById("studentAttendance").textContent = "Demo";
    document.getElementById("studentResult").textContent = "Demo Result";
    document.getElementById("studentFee").textContent = "Demo";
}

document.querySelector(".login-btn").onclick = () => openLogin("admin");
document.querySelector(".btn-secondary").onclick = () => openLogin("student");
document.querySelector(".portal.admin button").onclick = () => openLogin("admin");
document.querySelector(".portal.student button").onclick = () => openLogin("student");

document.querySelector(".contact form").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Message submitted successfully (Demo)");
    this.reset();
});

console.log("EduManage Loaded Successfully");
