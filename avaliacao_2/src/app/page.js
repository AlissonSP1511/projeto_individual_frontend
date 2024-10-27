"use client"
import Image from "next/image";
import styles from "./page.module.css";
import LoginForm from "./components/LoginForm";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <img
          // className={styles.logo}
          src="https://img.freepik.com/vetores-gratis/financas-investir-conjunto-de-simbolos-de-icones-de-elementos-de-doodle-de-negociacao-forex_56104-1029.jpg?t=st=1729231553~exp=1729235153~hmac=3caece32dcdb55c0f80ed1382a4e9884237fe021055b8b90b1900fcdb099ab7e&w=1060" 
          width={500}
          height={300}
          priority='true'
        />
        <ol>
          <li>
            Gestão de finanças pessoais.
          </li>
          <li>Um lugar para centralizar todos os gastos.</li>
        </ol>

        <Row className="d-flex justify-content-center align-items-center" >
          <Col>
          <Link
            className={styles.primary}
            href={"/pages/despesas"}
          >
            Lançar despesas
          </Link>
          </Col>
          <Col>
          <Link
            href="/pages/receitas"
            className={styles.secondary}
          >
            Lançar receitas
          </Link>
          </Col>
          {/* <Row>
            <h1>Login</h1>
            <LoginForm />
          </Row> */}
           <Col>
          <Link
            href="/pages/contas"
            className={styles.secondary}
          >
            Contas
          </Link>
           </Col>
           <Col>
          <Link
            href="/pages/usuarios"
            className={styles.secondary}
          >
            Usuarios
          </Link>
           </Col>
           <Col>
          <Link
            href="/pages/home"
            className={styles.secondary}
          >
            Home
          </Link>
           </Col>
        </Row>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
