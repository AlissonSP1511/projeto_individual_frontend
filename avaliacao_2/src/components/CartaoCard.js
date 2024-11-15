// projeto_individual_frontend/avaliacao_2/src/components/CartaoCard.js
'use client'

import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import { FaCreditCard, FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

export default function CartaoCard({ cartao, onDelete }) {
    const limiteDisponivel = cartao.limite - (cartao.limiteUtilizado || 0);
    const percentualUtilizado = ((cartao.limiteUtilizado || 0) / cartao.limite) * 100;

    return (
        <Card className="h-100 shadow-sm">
            <div className="position-relative">
                <div style={{ height: '120px', background: '#f8f9fa' }} className="d-flex align-items-center justify-content-center">
                    <FaCreditCard size={40} className="text-muted" />
                </div>
            </div>
            <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                    {cartao.nome}
                    <div>
                        <Link href={`/pages/cartoesDeCredito/form/${cartao._id}`} className="btn btn-sm btn-warning me-2">
                            <FaEdit />
                        </Link>
                        <button className="btn btn-sm btn-danger" onClick={() => onDelete(cartao._id)}>
                            <FaTrash />
                        </button>
                    </div>
                </Card.Title>
                <div className="card-info">
                    <small className="text-muted d-block mb-2">Número: {cartao.numero}</small>
                    <div className="progress-section mb-3">
                        <ProgressBar>
                            <ProgressBar variant="success" now={100 - percentualUtilizado} label={`R$ ${limiteDisponivel.toFixed(2)}`} />
                            <ProgressBar variant="danger" now={percentualUtilizado} label={`R$ ${(cartao.limiteUtilizado || 0).toFixed(2)}`} />
                        </ProgressBar>
                    </div>
                    <div className="card-details">
                        <strong className="d-block mb-2">Limite Total: R$ {cartao.limite.toFixed(2)}</strong>
                        <small className="d-block">Fechamento: Dia {cartao.diaFechamento}</small>
                        <small className="d-block">Vencimento: Dia {cartao.diaVencimento}</small>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
} 