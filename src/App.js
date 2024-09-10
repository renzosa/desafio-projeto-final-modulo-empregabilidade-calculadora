import React, { useState } from 'react';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [operacao, setOperacao] = useState('');
  const [num1, setNum1] = useState('');
  const [historico, setHistorico] = useState([]);
  const [memoria, setMemoria] = useState(null);
  const [calculoRecente, setCalculoRecente] = useState(false);

  const memoryClear = () => {
    setMemoria(null);
  };

  const memoryRecall = () => {
    if (memoria !== null) {
      setDisplay(memoria.toString());
    }
  };

  const memoryAdd = () => {
    setMemoria(prev => (prev || 0) + parseFloat(display));
  };

  const memorySubtract = () => {
    setMemoria(prev => (prev || 0) - parseFloat(display));
  };

  const clearHistory = () => {
    setHistorico([]);
  };

  const adicionarDigito = (digito) => {
    if (calculoRecente) {
      if (digito === '.') {
        setDisplay('0.');
      } else {
        setDisplay(digito);
      }
      setCalculoRecente(false);
    } else {
      if (digito === '.' && display === '0') {
        setDisplay('0.');
      } else if (digito === '.' && display.includes('.')) {
        return; // Evita adicionar múltiplos pontos decimais
      } else {
        setDisplay(prevDisplay => prevDisplay === '0' ? (digito === '.' ? '0.' : digito) : prevDisplay + digito);
      }
    }
  };

  const adicionarOperacao = (op) => {
    if (operacao !== '' && !calculoRecente) {
      calcular();
    } else if (op === '√' && display === '0') {
      setNum1('');
    } else if (num1 === '') {
      setNum1(display);
    }

    setOperacao(op);
    setCalculoRecente(true);
  };

  const apagarUltimoDigito = () => {
    setDisplay(prevDisplay => {
      if (prevDisplay.length === 1) {
        return '0';
      } else {
        return prevDisplay.slice(0, -1);
      }
    });
    setCalculoRecente(false);
  };

  const limpar = () => {
    setDisplay('0');
    setOperacao('');
    setNum1('');
  };

  const mudarSinal = () => {
    setDisplay(prevDisplay => (parseFloat(prevDisplay) * -1).toString());
  };

  const igual = () => {
    calcular();
    setNum1('');
    setOperacao('');
  };

  const calcular = () => {
    if (operacao) {
      let resultado;
      const n1 = parseFloat(num1);
      const n2 = parseFloat(display);

      switch (operacao) {
        case '+':
          resultado = n1 + n2;
          break;
        case '-':
          resultado = n1 - n2;
          break;
        case '×':
          resultado = n1 * n2;
          break;
        case '÷':
          resultado = n1 / n2;
          break;
        case '%':
          resultado = (n1 * n2) / 100;
          break;
        case '√':
          if (num1 === '') {
            resultado = Math.sqrt(n2);
          } else {
            resultado = Math.pow(n2, 1 / n1);
          }
          break;
        default:
          return;
      }

      let operacaoCompleta;
      if (operacao === '√' && num1 === '') {
        operacaoCompleta = `√${display} =`;
      } else {
        operacaoCompleta = `${num1} ${operacao} ${display} =`;
      }

      setHistorico(prev => [...prev, { operacao: operacaoCompleta, resultado: resultado.toLocaleString() }]);
      setDisplay(resultado.toString());
      setNum1(resultado.toString());
      setCalculoRecente(true);
    }
  };

  return (
    <div className="container calculator-app">
      <div class="container-header">
        <h1><i class="ri-calculator-fill"></i> Renzo | myCalculator</h1>
      </div>
      <div className="calculator-container">
        <div className="calculator">
          <div className="display">
            <div className="operation">{num1} {operacao}</div>
            <div className="result">{display}</div>
            <div className='memory'>{memoria !== null && <span className="memory-data"><i class="ri-ram-2-fill"></i> {memoria}</span>}</div>
          </div>
          <div className="buttons">

            <button className='memory-button' onClick={memoryClear} disabled={memoria === null}>MC</button>
            <button className='memory-button' onClick={memoryRecall} disabled={memoria === null}>MR</button>
            <button className='memory-button' onClick={memoryAdd}>M+</button>
            <button className='memory-button' onClick={memorySubtract}>M-</button>

            <button className='danger span-2' onClick={() => limpar()}><i class="ri-refresh-line"></i></button>
            <button className='secondary span-2' onClick={() => apagarUltimoDigito()}><i className="ri-delete-back-2-line"></i></button>

            <button onClick={() => adicionarOperacao('%')}><i class="ri-percent-line"></i></button>
            <button onClick={() => adicionarOperacao('√')}><i class="ri-square-root"></i></button>
            <button onClick={() => adicionarOperacao('÷')}><i class="ri-divide-line"></i></button>
            <button onClick={() => adicionarOperacao('×')}><i class="ri-asterisk"></i></button>

            <button onClick={() => adicionarDigito('7')}><i class="ri-number-7"></i></button>
            <button onClick={() => adicionarDigito('8')}><i class="ri-number-8"></i></button>
            <button onClick={() => adicionarDigito('9')}><i class="ri-number-9"></i></button>
            <button onClick={() => adicionarOperacao('-')}><i class="ri-subtract-line"></i></button>

            <button onClick={() => adicionarDigito('4')}><i class="ri-number-4"></i></button>
            <button onClick={() => adicionarDigito('5')}><i class="ri-number-5"></i></button>
            <button onClick={() => adicionarDigito('6')}><i class="ri-number-6"></i></button>
            <button onClick={() => adicionarOperacao('+')}><i class="ri-add-line"></i></button>

            <button onClick={() => adicionarDigito('1')}><i class="ri-number-1"></i></button>
            <button onClick={() => adicionarDigito('2')}><i class="ri-number-2"></i></button>
            <button onClick={() => adicionarDigito('3')}><i class="ri-number-3"></i></button>
            <button className='primary span-2-vert' onClick={igual}><i class="ri-equal-line"></i></button>

            <button onClick={() => mudarSinal()}><i class="ri-arrow-left-right-line"></i></button>
            <button onClick={() => adicionarDigito('0')}><i class="ri-number-0"></i></button>
            <button onClick={() => adicionarDigito('.')}>.</button>
          </div>
        </div>
        <div className="history">
          <div className='history-header'>
            <h3>Histórico</h3>
            <button className='clear-history' onClick={clearHistory}>Limpar Histórico</button>
          </div>
          <div className='history-container'>
            <div className='history-list'>
              <ul>
                {historico.slice().reverse().map((item, index) => (
                  <li key={index}>
                    <div className="operation">{item.operacao}</div>
                    <div className="result">{item.resultado}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;