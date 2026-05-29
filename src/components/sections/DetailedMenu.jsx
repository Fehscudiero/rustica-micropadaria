import React, { useState, useTransition } from 'react';
import { FaRegCalendarAlt, FaMotorcycle, FaCopy, FaCheck } from 'react-icons/fa';

export default function DetailedMenu({ content }) {
  const [activeTab, setActiveTab] = useState(content.categories[0].id);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tabId) => {
    // Usamos startTransition para otimizar o INP no celular, dando prioridade para o clique da aba
    startTransition(() => {
      setActiveTab(tabId);
    });
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(content.info.reservas.pixKey)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Falha ao copiar PIX: ', err);
      });
  };

  return (
    <section id="detailed-menu" className="detailed-menu section-pad">
      <div className="container">
        
        {/* Cabeçalho do Cardápio */}
        <div className="detailed-menu-header">
          <span className="detailed-menu-label">Cardápio do Forno</span>
          <h2 className="detailed-menu-title">{content.title}</h2>
          <p className="detailed-menu-subtitle">{content.subtitle}</p>
        </div>

        {/* Abas de Navegação (Tabs) */}
        <div className="menu-tabs-wrapper">
          <div className="menu-tabs" role="tablist" aria-label="Categorias do Cardápio">
            {content.categories.map((category) => (
              <button
                key={category.id}
                role="tab"
                aria-selected={activeTab === category.id}
                aria-controls={`panel-${category.id}`}
                id={`tab-${category.id}`}
                className={`menu-tab-btn ${activeTab === category.id ? 'is-active' : ''}`}
                onClick={() => handleTabChange(category.id)}
              >
                {category.name}
              </button>
            ))}
            <button
              role="tab"
              aria-selected={activeTab === 'info'}
              aria-controls="panel-info"
              id="tab-info"
              className={`menu-tab-btn ${activeTab === 'info' ? 'is-active' : ''}`}
              onClick={() => handleTabChange('info')}
            >
              Reservas
            </button>
          </div>
        </div>

        {/* Painéis de Conteúdo */}
        <div className={`menu-panels-container ${isPending ? 'is-switching' : ''}`}>
          
          {/* Painéis de Produtos */}
          {content.categories.map((category) => (
            activeTab === category.id && (
              <div
                key={category.id}
                id={`panel-${category.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${category.id}`}
                className="menu-panel animate-fade-in"
              >
                <div className="menu-items-grid">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="menu-item-row">
                      <div className="menu-item-info">
                        <span className="menu-item-name">{item.name}</span>
                        {item.tag && <span className="menu-item-tag">{item.tag}</span>}
                      </div>
                      <span className="menu-item-leader" aria-hidden="true" />
                      <span className="menu-item-price">{item.price}</span>
                    </div>
                  ))}
                </div>
                {category.footerNote && (
                  <p className="menu-panel-note">{category.footerNote}</p>
                )}
              </div>
            )
          ))}

          {/* Painel de Informações (Reservas & Entregas) */}
          {activeTab === 'info' && (
            <div
              id="panel-info"
              role="tabpanel"
              aria-labelledby="tab-info"
              className="menu-panel animate-fade-in"
            >
              <div className="info-cards-grid">
                
                {/* Cartão de Reservas */}
                <div className="info-card">
                  <div className="info-card-header">
                    <div className="info-card-icon">
                      <FaRegCalendarAlt />
                    </div>
                    <h3>{content.info.reservas.title}</h3>
                  </div>
                  <div className="info-card-body">
                    <ul className="info-list">
                      {content.info.reservas.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>

                    {/* Copiar Pix Container */}
                    <div className="pix-copy-container">
                      <span className="pix-label">Chave PIX (E-mail):</span>
                      <div className="pix-box">
                        <code className="pix-key">{content.info.reservas.pixKey}</code>
                        <button 
                          className={`pix-copy-btn ${copied ? 'is-copied' : ''}`}
                          onClick={handleCopyPix}
                          aria-label="Copiar chave PIX"
                        >
                          {copied ? <FaCheck className="icon-success" /> : <FaCopy />}
                          <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cartão de Entregas */}
                <div className="info-card">
                  <div className="info-card-header">
                    <div className="info-card-icon">
                      <FaMotorcycle />
                    </div>
                    <h3>{content.info.entregas.title}</h3>
                  </div>
                  <div className="info-card-body">
                    <ul className="info-list">
                      {content.info.entregas.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
