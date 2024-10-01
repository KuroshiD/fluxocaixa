function showNotification(message, type) {
    // Ensure there's a container for the notification right before the button
    let container = document.querySelector('.notification-container');
    const button = document.querySelector('.btn');
    
    if (!container) {
        container = document.createElement('div');
        container.classList.add('notification-container');
        button.insertAdjacentElement('beforebegin', container);
    }

    // Remove existing notification if any
    const existingNotification = container.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.classList.add('notification');
    
    let iconName, className;
    switch(type) {
        case 1:
            iconName = 'information-circle';
            className = 'info';
            break;
        case 2:
            iconName = 'warning';
            className = 'warning';
            break;
        case 3:
            iconName = 'alert-circle';
            className = 'error';
            break;
        default:
            iconName = 'checkmark-circle';
            className = 'success';
    }
    
    notification.classList.add(className);
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                <ion-icon name="${iconName}"></ion-icon>
            </span>
            <span>${message}</span>
        </div>
        <button class="close-btn">
            <ion-icon name="close"></ion-icon>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Add click event listener to close button
    notification.querySelector('.close-btn').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function setupPasswordToggle() {
    const passwordField = document.querySelector('#password').parentElement;
    passwordField.classList.add('password-field');
    
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.classList.add('toggle-password');
    toggleButton.innerHTML = '<ion-icon name="eye"></ion-icon>';
    
    passwordField.appendChild(toggleButton);
    
    toggleButton.addEventListener('click', function() {
        const passwordInput = this.previousElementSibling;
        const icon = this.querySelector('ion-icon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.setAttribute('name', 'eye-off');
        } else {
            passwordInput.type = 'password';
            icon.setAttribute('name', 'eye');
        }
    });
}

document.addEventListener('DOMContentLoaded', setupPasswordToggle);