
const emailCodeBtn = document.querySelector("#email-code-btn");
emailCodeBtn.addEventListener('click', sendEmailCode);

async function sendEmailCode() {
    const newEmail = document.querySelector("#new-email");

    const data = {email: newEmail.value};
    await axios.post('/api/auth/send-email-code', data)
    .then((result) => {
        if(!result.data) {
            window.alert("해당 이메일로 인증 코드를 보냈습니다.");
            newEmail.disabled = true;
            emailCodeBtn.disabled = true;
        }
        if(result.data) {
            window.alert("잘못된 형식 또는 사용할 수 없는 이메일입니다.");
        }
    })
}


const emailVerificationBtn = document.querySelector("#email-verification-btn");
emailVerificationBtn.addEventListener('click', emailVerification);

async function emailVerification() {
    const emailCode = document.querySelector("#email-code").value;
    const data = {code: emailCode}
    await axios.post('/api/auth/email-verification', data)
    .then((result) => {
        if(result.data) {
            window.location = '/api/auth/signup-step2'
        }
        if(!result.data) {
            window.alert("인증 코드가 일치하지 않습니다.");
        }
    })
}