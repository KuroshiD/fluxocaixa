const usernameField = document.querySelector('.register-username');
const emailField = document.querySelector('.register-email');
const passwordField = document.querySelector('.register-password');
const register = document.querySelector('.register');
const updateForm = document.querySelector('.form-register.att');
const currentPasswordField = document.querySelector('.edit-password');
const newUsernameField = document.querySelector('.edit-newusername');
const newPasswordField = document.querySelector('.edit-newpassword');
const confirmNewPasswordField = document.querySelector('.edit-confirmnewpassword');

const adminTableBody = document.querySelector('[data-info="admin-table"]');

const registerUser = async (data) => {
    const response = await apiUtils.post('/user/register', data);
    return response;
};

const deleteUser = async (id, username) => {
    if (!confirm(`Are you sure you want to delete user ${username}?`)) {
        return;
    }

    data = {
        id
    }


    const response = await apiUtils.delete('/user/delete', data);
    if (!response.success) {
        return alert(response.message);
    }

    alert('User deleted successfully');
    buildAdminTable();
};

const buildAdminTable = async () => {
    const response = await apiUtils.get('/user/getAll');
    if (!response.success) {
        return alert(response.message);
    }

    const admins = response.data;
    adminTableBody.innerHTML = '';

    admins.forEach(admin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${admin.username}</td>
            <td>
                <i class="fa fa-trash-o trashcan" style="font-size:16px;color:red" onclick="deleteUser('${admin.id}', '${admin.username}')"></i>
            </td>
        `;
        adminTableBody.appendChild(row);
    });
};

const handleRegister = async (e) => {
    e.preventDefault();

    const username = usernameField.value;
    const email = emailField.value;
    const password = passwordField.value;

    const data = {
        username,
        email,
        password
    };

    const response = await registerUser(data);

    if (!response.success) 
        return alert(response.data.message);

    alert('User registered successfully');

    usernameField.value = emailField.value = passwordField.value = '';
}

const updateUser = async (data) => {
    const response = await apiUtils.put('/user/update', data);
    return response;
};

const handleUpdate = async (e) => {
    e.preventDefault();

    const currentPassword = currentPasswordField.value;
    const newUsername = newUsernameField.value;
    const newPassword = newPasswordField.value;
    const confirmNewPassword = confirmNewPasswordField.value;

    if (newPassword !== confirmNewPassword) {
        return alert('New passwords do not match');
    }

    const data = {
        currentPassword,
        newUsername,
        newPassword
    };

    const response = await updateUser(data);

    if (!response.success) 
        return alert(response.data.message);

    alert('User updated successfully');

    currentPasswordField.value = newUsernameField.value = newPasswordField.value = confirmNewPasswordField.value = '';
}

updateForm.addEventListener("submit", handleUpdate);
register.addEventListener("submit", handleRegister);
document.addEventListener('DOMContentLoaded', buildAdminTable)





