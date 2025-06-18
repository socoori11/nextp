import React, {useState, useRef} from 'react'
import styles from '@/styles/Signup.module.scss'

const Signup = () => {
    
    const [form, setform] = useState({
        userid:'',
        email:'',
        password:'',
        checkpassword:'',
        name:'',
        phone: '',
        birth:'',
        gender:'',
        address:'',
    });
    const [message, setmessage] =useState('');
    const useridref = useRef<HTMLInputElement>(null)
    const passref = useRef<HTMLInputElement>(null)

    const fchange = ( e : React.ChangeEvent<HTMLInputElement  | HTMLSelectElement>) =>{
       const { name, value } = e.target
       setform({ ...form, [name] : value})
    }
    
    const fsubmit= async (e:React.FormEvent) =>{
        e.preventDefault()

        try {
            const res = await fetch('/api/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(form),
            })
        
            const data = await res.json()
        
            if (res.ok) {
              setmessage('가입 성공! 로그인해주세요.')
              setform({
                userid: '',
                email: '',
                password: '',
                checkpassword: '',
                name: '',
                phone: '',    
                birth: '',
                gender: '',
                address: '',
              })
            } else {
              setmessage(data.error || '가입 실패')
            }
          } catch (err) {
            console.error(err)
            setmessage('서버 오류')
          }


      }
  return (
    <div className={styles.signup}>
        <div className={styles.box}>
            <h2>회원가입</h2>
            { message && ( <div className={styles.alarmbox}>
                            <span>{message}</span>
                            <button type="button" onClick={() => setmessage('')}>확인</button>
                           </div>)}
            <form className={styles.formss} onSubmit={fsubmit}>
                <div className={styles.fieldgroup}>
                    <label>아이디</label>
                    <input type="text" name="userid" value={form.userid} onChange={fchange} ref={useridref} 
                    placeholder='아이디는 4자 이상이며 영어를 포함해야 합니다' required
                    onBlur={
                        () => {
                        const useridreg = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,}$/
                        if (!useridreg.test(form.userid)) {
                            setmessage('규칙오류 : 아이디는 4자 이상이며 영어를 포함해야 합니다.')
                            useridref.current?.focus()
                        }else {
                            setmessage('')
                        }
                      }
                    }
                    
                    />
                    <button type="button" className={styles.bb} onClick={async () => {
                        const res = await fetch(`/api/check-id?userid=${form.userid}`)
                        const data = await res.json()
                        if (data.exists) {
                            setmessage('이미 사용 중인 아이디입니다.')
                        } else {
                            setmessage('사용 가능한 아이디입니다.')
                        }
                        }}>
                       중복확인
                    </button>

                    
                </div>
                <div className={styles.fieldgroup}>
                    <label>패스워드</label>
                    <input type="text" name="password" value={form.password} onChange={fchange} ref={passref}
                    placeholder=' 비밀번호는 4자 이상, 영문자 + 특수기호 포함해야 합니다'
                     onBlur={
                        () => {
                        const passreg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]{4,}$/
                        if (!passreg.test(form.password)) {
                            setmessage('규칙오류 : 비밀번호는 4자 이상, 영문자 + 특수기호 포함해야 합니다.')
                            passref.current?.focus()
                        }else {
                            setmessage('')
                            return
                        }
                         }
                    }
                     required
                    />
                     
                </div>
                
               
                <div className={styles.fieldgroup}>
                    <label>패스워드확인</label>
                    <input type="text" name="checkpassword" value={form.checkpassword} onChange={fchange}
                    onBlur={
                        () => {
                           
                                if (form.password !== form.checkpassword) {
                                    setmessage('비밀번호가 일치하지 않습니다.')
                                }else {
                                    setmessage('')
                                }
                         }
                    }
                
                    required
                    />
                  </div>
                  <div className={styles.fieldgroup}>
                    <label>이메일</label>
                    <input type="email" name="email" value={form.email} onChange={fchange} required />
                  </div>
                  <div className={styles.fieldgroup}>
                    <label>이 &nbsp;&nbsp; 름</label>
                    <input type="text" name="name" value={form.name} onChange={fchange} required />
                  </div>
                  <div className={styles.fieldgroup}>
                    <label>연락처</label>
                    <input type="text" name="phone" value={form.phone} placeholder='010부터 숫자만 입력하세요'
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '') // 숫자만 남기기
                          let formatted = raw

                          if (raw.length <= 3) {
                              formatted = raw
                          } else if (raw.length <= 7) {
                              formatted = raw.slice(0, 3) + '-' + raw.slice(3)
                          } else {
                              formatted = raw.slice(0, 3) + '-' + raw.slice(3, 7) + '-' + raw.slice(7, 11)
                          }

                          setform({ ...form, phone: formatted })
                        }}
    maxLength={13} // 하이픈 포함 길이 제한
     required />
                  </div>
                  <div className={styles.fieldgroup}>
                    <label>생년월일</label>
                    <input type="date" name="birth" value={form.birth} onChange={fchange} required />
                  </div>
                  <div className={styles.fieldgroup}>
                    <label>성 &nbsp;&nbsp; 별</label>
                    <select name="gender" value={form.gender}  onChange={fchange} required>
                        <option value="">선택</option>
                        <option value="M">남성</option>
                        <option value="F">여성</option>
                    </select>
                </div>
                <div className={styles.fieldgroup}>
                    <label>주 &nbsp;&nbsp; 소</label>
                    <input type="text" name="address" value={form.address} onChange={fchange} required />
                </div>
                <button type="submit">가입하기</button>
            </form>
        </div>
    </div>
  )
}

export default Signup