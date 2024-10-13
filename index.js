document.addEventListener("DOMContentLoaded", loadStudents); // Load students when the page is loaded
const Addbutton = document.getElementById("addbutton");
let editIndex = -1; // Keeps track if we are editing a row

Addbutton.addEventListener("click", register);

// Regular expressions for validation
const nameRegex = /^[a-zA-Z\s]+$/; // Allows letters and spaces
const idRegex = /^[0-9]+$/; // Allows only numbers
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
const contactRegex = /^[0-9]{10}$/; // Allows exactly 10 digits for the contact number

function register(event) {
    event.preventDefault();

    const Name = document.getElementById("name");
    const ID = document.getElementById("std-id");
    const Email = document.getElementById("std-email");
    const Contact = document.getElementById("contact");

    // Validate input fields
    if (!Name.value || !ID.value || !Email.value || !Contact.value) {
        alert("All fields are required for registration");
        return;
    }

    if (!nameRegex.test(Name.value)) {
        alert("Student name must contain only letters and spaces");
        return;
    }

    if (!idRegex.test(ID.value)) {
        alert("Student ID must contain only numbers");
        return;
    }

    if (!emailRegex.test(Email.value)) {
        alert("Please enter a valid email address");
        return;
    }

    if (!contactRegex.test(Contact.value)) {
        alert("Contact number must contain exactly 10 digits");
        return;
    }

    // Retrieve current student data from localStorage
    let students = JSON.parse(localStorage.getItem("students")) || [];

    if (editIndex === -1) {
        // Add new student
        students.push({
            name: Name.value,
            id: ID.value,
            email: Email.value,
            contact: Contact.value
        });
    } else {
        // Update existing student
        students[editIndex] = {
            name: Name.value,
            id: ID.value,
            email: Email.value,
            contact: Contact.value
        };
        editIndex = -1;  // Reset edit index
    }

    // Save updated student list to localStorage
    localStorage.setItem("students", JSON.stringify(students));

    // Clear form inputs
    Name.value = '';
    ID.value = '';
    Email.value = '';
    Contact.value = '';

    // Refresh student table
    loadStudents();
}

// Function to delete a student record
function deleteRow(index) {
    let students = JSON.parse(localStorage.getItem("students")) || [];
    students.splice(index, 1); // Remove the student from the list
    localStorage.setItem("students", JSON.stringify(students)); // Save updated list
    loadStudents(); // Refresh table
}

// Function to edit a student record
function editRow(index) {
    editIndex = index; // Track the row being edited

    // Retrieve current student data from localStorage
    let students = JSON.parse(localStorage.getItem("students")) || [];

    // Fill the form with existing data
    document.getElementById("name").value = students[index].name;
    document.getElementById("std-id").value = students[index].id;
    document.getElementById("std-email").value = students[index].email;
    document.getElementById("contact").value = students[index].contact;
}

// Function to load and display students from localStorage
function loadStudents() {
    const tbody = document.getElementById("studentListBody");
    tbody.innerHTML = ""; // Clear only the table body before loading

    // Retrieve students from localStorage
    let students = JSON.parse(localStorage.getItem("students")) || [];

    // Iterate over students and add them to the table body
    students.forEach((student, index) => {
        const row = tbody.insertRow();
        const stname = row.insertCell(0);
        const stid = row.insertCell(1);
        const stemail = row.insertCell(2);
        const contact = row.insertCell(3);
        const actions = row.insertCell(4);

        stname.innerHTML = student.name;
        stid.innerHTML = student.id;
        stemail.innerHTML = student.email;
        contact.innerHTML = student.contact;
        actions.innerHTML = `<button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button>`;

        // Attach event listeners to the edit and delete buttons
        actions.querySelector('.edit-btn').addEventListener('click', () => editRow(index));
        actions.querySelector('.delete-btn').addEventListener('click', () => deleteRow(index));
    });

    // Add scrollbar dynamically if the table overflows
    const tableWrapper = document.getElementById("studentList")
    if (students.length > 4) {
        tableWrapper.style.overflowY = "scroll";
        tableWrapper.style.maxHeight = "300px";
    } else {
        tableWrapper.style.overflowY = "visible";
        tableWrapper.style.maxHeight = "none";
    }
}
