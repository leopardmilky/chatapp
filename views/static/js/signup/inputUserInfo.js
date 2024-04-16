

async function register() {
    const newNickname = document.querySelector("#new-nickname").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;
    const data = {password: password, confirmPassword: confirmPassword, newNickname: newNickname};
    await axios.post('/api/auth/register', data)
    .then((result) => {
        if(result.data === 'nomatch') {
            window.alert('비밀번호가 일치하지 않습니다.');
        }
        if(result.data === 'needmore') {
            window.alert('비밀번호는 최소 8자리 이상입니다.');
        }
        if(result.data === 'notok') {
            window.alert('페이지 시간초과. 처음부터 다시 진행해 주세요.');
            window.location = '/api/auth/signup-step1';
        }
        if(result.data === 'ok') {
            window.alert('회원가입 완료!');
            window.location = '/api/auth/signin';
        }
    })
}