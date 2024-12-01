import React from 'react'
import '../styles/Footer.css'

export default function Footer() {
    return (
        <div id='footer'>
            <div id='aboutus'>
                <img src="/logo.png" height={100} width={100} style={{ marginBottom: 10 }} />
                <h2>About us</h2>
                <p>Lost Chef is your ultimate recipe finder, helping you discover delicious recipes with ease. Whether you're a novice or a pro, find recipes that suit your taste and skills!</p>
            </div>
            <div id='contactus'>
                <h2>Contact us</h2>
                <a style={{ color: "white", textDecoration: "none" }} href='mailto://supportlostcheif@gmail.com'>Email: supportlostcheif@gmail.com</a>
                <a style={{ color: "white", textDecoration: "none" }} href='tel:9812345678'>Phone: +977 9812345678</a>
                <div style={{ marginTop: 5, display: "flex", gap: 10 }}>
                    <a href='https://facebook.com/lostcheif'><img src='/facebook.png' height={20} width={20} /></a>
                    <a href='https://instagram.com/lostcheif'><img src='/instagram.png' height={20} width={20} /></a>
                </div>
            </div>
        </div>
    )
}
