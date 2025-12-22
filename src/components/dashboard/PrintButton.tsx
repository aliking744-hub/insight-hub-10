import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoIcon from '@/assets/logo-icon.png';

interface PrintButtonProps {
  title?: string;
}

export function PrintButton({ title = 'گزارش داشبورد منابع انسانی' }: PrintButtonProps) {
  const handlePrint = () => {
    // Add logo and title to print header
    const printStyle = document.createElement('style');
    printStyle.id = 'print-styles';
    printStyle.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-area, .print-area * {
          visibility: visible;
        }
        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          direction: rtl;
        }
        .print-header {
          display: flex !important;
          flex-direction: row-reverse;
          align-items: center;
          justify-content: flex-start;
          gap: 16px;
          padding: 20px;
          border-bottom: 2px solid #1e3a5f;
          margin-bottom: 20px;
          width: 100%;
        }
        .print-header img {
          height: 60px;
          width: auto;
        }
        .print-header h1 {
          font-size: 24px;
          color: #1e3a5f;
          flex-grow: 1;
          text-align: right;
        }
        .no-print {
          display: none !important;
        }
        .recharts-wrapper,
        .recharts-surface {
          width: 100% !important;
          height: auto !important;
        }
        .grid {
          display: block !important;
        }
        .grid > div {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
      }
    `;
    document.head.appendChild(printStyle);
    
    window.print();
    
    // Cleanup
    setTimeout(() => {
      const style = document.getElementById('print-styles');
      if (style) style.remove();
    }, 1000);
  };

  return (
    <>
      {/* Print Header - hidden until print */}
      <div className="print-header hidden">
        <img src={logoIcon} alt="hring logo" />
        <h1>{title}</h1>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePrint}
        className="gap-2 font-iransans no-print"
      >
        <Printer className="w-4 h-4" />
        پرینت
      </Button>
    </>
  );
}
