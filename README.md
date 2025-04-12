# 🔐 SubhPass – A Stylish & Secure Personal Password Manager

Welcome to **SubhPass**, your **portable web-based password manager** that uses a **3-digit PIN login system** with beautiful UI, security features like **AES encryption**, and smooth animations. Designed with **OOP concepts** and packed with features to impress your teachers and protect your passwords.

---

## ✨ Features

✅ 3-digit PIN-based login (with PIN Pad)  
✅ Add, View, Edit, and Delete password entries  
✅ Change 3-digit PIN securely  
✅ Master unlock question in case of forgotten PIN  
✅ AES encryption for password security (CryptoJS)  
✅ Beautiful UI with **Glassmorphism** and **Animations**  
✅ Object-Oriented Programming with `class PasswordEntry {}`  
✅ Export/Import encrypted password data as JSON  
✅ Activity Log with timestamps  
✅ Dark/Light mode toggle (stored in localStorage)  
✅ Random strong password generator  
✅ Cool login vault animation with sound effects

---

## 🔧 Tech Stack

| Technology      | Purpose                      |
|-----------------|------------------------------|
| HTML/CSS/TailwindCSS | Layout & Styling         |
| JavaScript      | Interactivity & Logic        |
| CryptoJS        | AES Encryption               |
| localStorage    | Offline Data Storage         |
| Framer Motion / Animate.css | Animations       |
| GitHub Pages / Netlify | Hosting                |

---

## 🧠 OOP Concept Highlight

We use a class to manage password data:

```js
class PasswordEntry {
  constructor(serviceName, username, encryptedPassword, timestamp) {
    this.serviceName = serviceName;
    this.username = username;
    this.encryptedPassword = encryptedPassword;
    this.timestamp = timestamp;
  }
}
