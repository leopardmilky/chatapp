
const phoneCodeBtn = document.querySelector("#phone-code-btn");
phoneCodeBtn.addEventListener('click', sendPhoneCode);

async function sendPhoneCode() {
    const newPhone = document.querySelector("#new-phone");

    const data = {phone: newPhone.value};
    await axios.post('/api/auth/send-phone-code', data)
    .then((result) => {
        if(!result.data) {
            window.alert("해당 휴대폰으로 인증 코드를 보냈습니다.");
            newPhone.disabled = true;
            phoneCodeBtn.disabled = true;
        }
        if(result.data) {
            window.alert("잘못된 형식 또는 사용할 수 없는 휴대폰입니다.");
        }
    })
}


const phoneVerificationBtn = document.querySelector("#phone-verification-btn");
phoneVerificationBtn.addEventListener('click', phoneVerification);

async function phoneVerification() {
    const phoneCode = document.querySelector("#phone-code");
    const data = {code: phoneCode.value}
    await axios.post('/api/auth/phone-verification', data)
    .then((result) => {
        if(result.data) {
            window.location = '/api/auth/signup-step3'
        }
        if(!result.data) {
            window.alert("인증 코드가 일치하지 않습니다.");
        }
    })
}