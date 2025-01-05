import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from '../services/firebase';
import { useNavigate } from "react-router-dom";

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#f0f9ff',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    input: {
        marginBottom: '10px',
        padding: '10px',
        width: '200px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
    },
    title: {
        marginBottom: '20px',
    }
};

function ForgotPassWord() {
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emalVal = e.target.email.value;
        sendPasswordResetEmail(auth, emalVal).then(data => {
            alert("Check your gmail");
            history("/");
        }).catch(err => {
            alert(err.code);
        });
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Forgot Password</h1>
            <form style={styles.form} onSubmit={handleSubmit}>
                <input style={styles.input} name="email" placeholder="Enter your email" /><br />
                <button style={styles.button}>Reset</button>
            </form>
        </div>
    );
}

export default ForgotPassWord;