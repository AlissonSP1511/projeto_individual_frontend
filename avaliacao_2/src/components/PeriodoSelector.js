import { useRef, useState } from "react";
import { Form } from "react-bootstrap";

const PeriodoSelector = ({ periodoVisualizacao, setPeriodoVisualizacao, unidadeTempo, setUnidadeTempo }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipValue, setTooltipValue] = useState(periodoVisualizacao);
    const sliderRef = useRef(null);

    const handleSliderChange = (e) => {
        const newValue = parseInt(e.target.value);
        setPeriodoVisualizacao(newValue);
        setTooltipValue(newValue);
    };

    const handleMouseMove = (e) => {
        if (sliderRef.current && showTooltip) {
            const rect = sliderRef.current.getBoundingClientRect();
            const max = unidadeTempo === 'anos' ? 60 : 720;
            const position = ((e.clientX - rect.left) / rect.width);
            const value = Math.round(position * max);

            if (value >= 1 && value <= max) {
                setTooltipValue(value);
            }
        }
    };

    return (
        <Form.Group className="position-relative">
            <Form.Label>
                Período de visualização: {periodoVisualizacao} {unidadeTempo}
            </Form.Label>
            <div className="d-flex align-items-center gap-3">
                <div
                    className="position-relative"
                    style={{ flex: 1 }}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onMouseMove={handleMouseMove}
                >
                    <Form.Range
                        ref={sliderRef}
                        value={periodoVisualizacao}
                        onChange={handleSliderChange}
                        min={1}
                        max={unidadeTempo === 'anos' ? 60 : 720}
                        step={1}
                        style={{ cursor: 'pointer' }}
                    />
                    {showTooltip && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '-30px',
                                left: `${(periodoVisualizacao / (unidadeTempo === 'anos' ? 60 : 720)) * 100}%`,
                                transform: 'translateX(-50%)',
                                backgroundColor: '#333',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                pointerEvents: 'none',
                                whiteSpace: 'nowrap',
                                zIndex: 1000,
                                transition: 'left 0.1s ease-out'
                            }}
                        >
                            {tooltipValue} {unidadeTempo}
                        </div>
                    )}
                </div>
                <Form.Select
                    value={unidadeTempo}
                    onChange={(e) => {
                        const novaUnidade = e.target.value;
                        setUnidadeTempo(novaUnidade);
                        if (novaUnidade === 'anos') {
                            const novoValor = Math.min(Math.ceil(periodoVisualizacao / 12), 60);
                            setPeriodoVisualizacao(novoValor);
                            setTooltipValue(novoValor);
                        } else {
                            const novoValor = Math.min(periodoVisualizacao * 12, 720);
                            setPeriodoVisualizacao(novoValor);
                            setTooltipValue(novoValor);
                        }
                    }}
                    style={{ width: '100px' }}
                >
                    <option value="meses">Meses</option>
                    <option value="anos">Anos</option>
                </Form.Select>
            </div>
        </Form.Group>
    );
};

export default PeriodoSelector;