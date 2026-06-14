// Simple chart components for the Progress Dashboard
// These are custom components that don't require external libraries

export const BarChart = ({ data, labels, title, color, height = 'auto' }) => {
  const maxValue = Math.max(...data);
  
  return (
    <div style={{ 
      padding: '1.5rem',
      backgroundColor: 'rgba(250, 250, 255, 0.02)',
      border: '1px solid var(--glass-border)',
      borderRadius: '16px',
      backdropFilter: 'blur(30px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
      height
    }}>
      <h3 style={{ 
        color: 'var(--pure-pearl)',
        fontSize: '1.1rem',
        fontWeight: '600',
        marginBottom: '1.5rem'
      }}>
        {title}
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.map((value, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              minWidth: '80px',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {labels[index]}
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{
                width: '100%',
                height: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(value / maxValue) * 100}%`,
                  height: '100%',
                  background: color,
                  borderRadius: '12px',
                  transition: 'width 0.6s ease'
                }} />
              </div>
              <div style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--pure-pearl)',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                {value}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LineChart = ({ data, labels, title, color, height = '200px' }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  return (
    <div style={{ 
      padding: '1.5rem',
      backgroundColor: 'rgba(250, 250, 255, 0.02)',
      border: '1px solid var(--glass-border)',
      borderRadius: '16px',
      backdropFilter: 'blur(30px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
    }}>
      <h3 style={{ 
        color: 'var(--pure-pearl)',
        fontSize: '1.1rem',
        fontWeight: '600',
        marginBottom: '1.5rem'
      }}>
        {title}
      </h3>
      
      <div style={{ position: 'relative', height, marginBottom: '1rem' }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <div
            key={percent}
            style={{
              position: 'absolute',
              bottom: `${percent}%`,
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              zIndex: 1
            }}
          />
        ))}
        
        {/* Chart line */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2
          }}
        >
          <polyline
            points={data.map((value, index) => {
              const x = data.length > 1 ? (index / (data.length - 1)) * 100 : 50;
              const y = 100 - ((value - minValue) / range) * 100;
              return `${x}%,${y}%`;
            }).join(' ')}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((value, index) => {
            const x = data.length > 1 ? (index / (data.length - 1)) * 100 : 50;
            const y = 100 - ((value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="5"
                fill={color}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
      
      {/* Labels */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        overflowX: 'auto'
      }}>
        {labels.map((label, index) => (
          <div key={index} style={{ minWidth: '40px', textAlign: 'center' }}>
            {label.length > 10 ? label.substring(0, 10) + '...' : label}
          </div>
        ))}
      </div>
    </div>
  );
};

export const PieChart = ({ data, labels, title, colors }) => {
  const total = data.reduce((sum, value) => sum + value, 0);
  let currentAngle = 0;
  
  return (
    <div style={{ 
      padding: '1.5rem',
      backgroundColor: 'rgba(250, 250, 255, 0.02)',
      border: '1px solid var(--glass-border)',
      borderRadius: '16px',
      backdropFilter: 'blur(30px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
    }}>
      <h3 style={{ 
        color: 'var(--pure-pearl)',
        fontSize: '1.1rem',
        fontWeight: '600',
        marginBottom: '1.5rem'
      }}>
        {title}
      </h3>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {/* Pie Chart */}
        <div style={{ position: 'relative', width: '150px', height: '150px' }}>
          <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
            {data.map((value, index) => {
              const percentage = (value / total) * 100;
              const angle = (percentage / 100) * 360;
              const endAngle = currentAngle + angle;
              
              const x1 = 75 + 60 * Math.cos((currentAngle * Math.PI) / 180);
              const y1 = 75 + 60 * Math.sin((currentAngle * Math.PI) / 180);
              const x2 = 75 + 60 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 75 + 60 * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 75 75`,
                `L ${x1} ${y1}`,
                `A 60 60 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle = endAngle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index]}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
        </div>
        
        {/* Legend */}
        <div style={{ flex: 1 }}>
          {labels.map((label, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                backgroundColor: colors[index]
              }} />
              <div style={{ 
                color: 'var(--pure-pearl)',
                fontSize: '0.9rem'
              }}>
                {label}: {Math.round((data[index] / total) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StatCard = ({ title, value, subtitle, color, icon }) => {
  return (
    <div className="glass-card" style={{ 
      padding: '1.5rem',
      textAlign: 'center',
      background: 'rgba(250, 250, 255, 0.02)',
      border: '1px solid var(--glass-border)',
      backdropFilter: 'blur(30px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Icon */}
      {icon && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          fontSize: '2rem',
          opacity: 0.3,
          color
        }}>
          {icon}
        </div>
      )}
      
      <div style={{ 
        fontSize: '2.5rem', 
        fontWeight: '700',
        color,
        marginBottom: '0.5rem'
      }}>
        {value}
      </div>
      <div style={{ color: 'var(--pure-pearl)', fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
        {title}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        {subtitle}
      </div>
    </div>
  );
};
