import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportToXLSX(filename: string, headers: string[], rows: (string | number)[][], columnWidths?: number[]) {
  const data = headers && headers.length > 0 ? [headers, ...rows] : rows;
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Relatório');

  // Adicionar as linhas
  worksheet.addRows(data);

  // Aplicar larguras de coluna
  if (columnWidths && columnWidths.length > 0) {
    columnWidths.forEach((w, i) => {
      worksheet.getColumn(i + 1).width = w;
    });
  }

  let tableHeaderRowIndex = -1;

  // Aplicar estilos
  worksheet.eachRow((row, rowNumber) => {
    // Detectar a linha de cabeçalho da tabela verificando o valor da primeira célula
    const firstCellVal = row.getCell(1).value;
    if (typeof firstCellVal === 'string') {
      const val = firstCellVal.toUpperCase();
      if (['Nº DO ITEM', 'PRODUTO', 'FORMA DE PAGAMENTO', 'RANKING', 'DATA', 'Nº DO PEDIDO'].includes(val)) {
        tableHeaderRowIndex = rowNumber;
      }
    }

    row.eachCell((cell, colNumber) => {
      // Alinhamento padrão
      cell.alignment = { vertical: 'middle', horizontal: typeof cell.value === 'number' ? 'right' : 'left' };

      // Estilo do Título Principal (Linha 1) - Slate-900 (Escuro Executivo)
      if (rowNumber === 1) {
        cell.font = { name: 'Arial', size: 18, bold: true, color: { argb: 'FF0F172A' } };
        return;
      }

      if (tableHeaderRowIndex === rowNumber) {
        // Estilo do cabeçalho da tabela (Fundo Escuro Slate-800 e Texto Branco)
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }; 
        cell.font = { name: 'Arial', bold: true, color: { argb: 'FFFFFFFF' } };
        cell.border = { 
          top: { style: 'medium', color: { argb: 'FF0F172A' } }, 
          bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
          left: { style: 'thin', color: { argb: 'FF334155' } },
          right: { style: 'thin', color: { argb: 'FF334155' } }
        };
      } 
      else if (tableHeaderRowIndex !== -1 && rowNumber > tableHeaderRowIndex) {
        // Linhas de dados da tabela (Zebradas Sutis e Clean)
        cell.font = { name: 'Arial', color: { argb: 'FF334155' } }; // Slate-700
        if (rowNumber % 2 === 0) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } }; // Slate-50
        } else {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // Branco
        }
        cell.border = { 
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } }, // Slate-200
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
      } 
      else {
        // Seção Superior (KPIs, Totais, Cabeçalhos Gerais)
        const isTopSection = tableHeaderRowIndex === -1;
        
        if (typeof cell.value === 'string') {
          // Converter strings de Moeda para formato nativo do Excel
          if (cell.value.startsWith('R$ ')) {
            const numericVal = parseFloat(cell.value.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
            if (!isNaN(numericVal)) {
              cell.value = numericVal;
              cell.numFmt = '"R$ "#,##0.00';
              if (isTopSection) cell.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF0F172A' } };
            }
          }
          // Converter strings de Porcentagem para formato nativo do Excel
          else if (cell.value.match(/^-?\d+(,\d+)?%$/) || cell.value.match(/^-?\d+(\.\d+)?%$/)) {
            const numericVal = parseFloat(cell.value.replace('%', '').replace(',', '.'));
            if (!isNaN(numericVal)) {
              cell.value = numericVal / 100;
              cell.numFmt = '0.00%';
              if (isTopSection) cell.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF0F172A' } };
            }
          }
          else {
            const val = cell.value.toUpperCase();
            if (['PERÍODO', 'DATA', 'VALOR DA VENDA', 'IMPOSTOS SOBRE VENDAS (0%)', 'TOTAL DE VENDAS', 
                 'FATURAMENTO BRUTO', 'TOTAL DE TAXAS', 'FATURAMENTO LÍQUIDO',
                 'TOTAL DE ITENS NO ESTOQUE', 'ALERTA DE ESTOQUE BAIXO', 'PERDAS REGISTRADAS',
                 'TOTAL DE CLIENTES', 'TICKET MÉDIO GERAL', 'CLIENTES RECORRENTES', 'TOTAL',
                 'AGRUPAMENTO', 'MÉDIA DIÁRIA', 'CRESCIMENTO', 'PROJEÇÃO'].includes(val)) {
              cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF64748B' } }; // Slate-500 (Rótulo Menor)
            } else {
              cell.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF0F172A' } }; // Valores em destaque (Slate-900)
            }
          }
        }
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}.xlsx`);
}

export function formatCurrency(val: number) {
  return `R$ ${val.toFixed(2).replace('.', ',')}`;
}
