// ExportService.ts - Universal Export Service for Reports and Data
// Supports: HTML, ATLAS.ti, MAXQDA, SPSS, and more

export class ExportService {
  /**
   * Convert Markdown to HTML with professional styling
   */
  static markdownToHTML(markdown: string, title: string = 'EVIDENRA Report'): string {
    // Enhanced Markdown to HTML conversion with better pattern matching
    let html = markdown;

    // First, normalize line breaks and clean up
    html = html.replace(/\r\n/g, '\n');
    html = html.replace(/\r/g, '\n');

    // Headers - Process in order: #### -> ### -> ## -> #
    // Match headers both at line start and inline
    html = html.replace(/#{4}\s*(.+?)(?:\n|$)/g, '<h4>$1</h4>\n');
    html = html.replace(/#{3}\s*(.+?)(?:\n|$)/g, '<h3>$1</h3>\n');
    html = html.replace(/#{2}\s*(.+?)(?:\n|$)/g, '<h2>$1</h2>\n');
    html = html.replace(/#{1}\s+(.+?)(?:\n|$)/g, '<h1>$1</h1>\n');

    // Bold
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Lists - Better pattern for both * and -
    html = html.replace(/^[\*\-]\s+(.+)$/gim, '<li>$1</li>');

    // Code blocks
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert double line breaks to paragraphs
    html = html.replace(/\n\n+/g, '</p><p>');

    // Convert single line breaks to <br>
    html = html.replace(/\n/g, '<br>');

    // Wrap lists in <ul> tags
    html = html.replace(/(<li>.*?<\/li>)(<br>)?/gs, function(match) {
      if (!match.includes('<ul>')) {
        return '<ul>' + match.replace(/<br>/g, '') + '</ul>';
      }
      return match;
    });

    // Wrap in paragraphs if not already wrapped in other tags
    html = '<p>' + html + '</p>';

    // Clean up: Remove empty paragraphs and fix tag nesting
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<br><\/p>/g, '</p>');
    html = html.replace(/<p><br>/g, '<p>');

    // Generate full HTML document with professional styling
    return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="EVIDENRA Professional">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.8;
            color: #2c3e50;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .header {
            border-bottom: 4px solid #667eea;
            padding-bottom: 30px;
            margin-bottom: 40px;
        }

        .logo {
            font-size: 14px;
            color: #667eea;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }

        h1 {
            color: #1a202c;
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 15px;
            line-height: 1.2;
        }

        h2 {
            color: #2d3748;
            font-size: 28px;
            font-weight: 600;
            margin-top: 50px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
        }

        h3 {
            color: #4a5568;
            font-size: 22px;
            font-weight: 600;
            margin-top: 35px;
            margin-bottom: 15px;
        }

        p {
            margin-bottom: 20px;
            text-align: justify;
        }

        ul {
            margin-bottom: 20px;
            padding-left: 30px;
        }

        li {
            margin-bottom: 10px;
            line-height: 1.6;
        }

        strong {
            color: #2d3748;
            font-weight: 600;
        }

        em {
            font-style: italic;
            color: #4a5568;
        }

        code {
            background: #f7fafc;
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: #667eea;
            border: 1px solid #e2e8f0;
        }

        a {
            color: #667eea;
            text-decoration: none;
            border-bottom: 1px solid #667eea;
            transition: all 0.3s;
        }

        a:hover {
            color: #764ba2;
            border-bottom-color: #764ba2;
        }

        .footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #718096;
            font-size: 14px;
        }

        .footer .timestamp {
            margin-top: 10px;
            font-size: 12px;
            color: #a0aec0;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }

            .container {
                box-shadow: none;
                padding: 40px;
            }

            a {
                color: #2c3e50;
                border-bottom: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🔬 EVIDENRA Professional</div>
            <h1>${title}</h1>
        </div>

        <div class="content">
            ${html}
        </div>

        <div class="footer">
            <strong>Generiert mit EVIDENRA Professional</strong><br>
            Qualitative Inhaltsanalyse mit KI-Unterstützung
            <div class="timestamp">
                Exportiert am: ${new Date().toLocaleString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Export to ATLAS.ti format (.txt with special formatting)
   * ATLAS.ti can import plain text with document structure
   */
  static exportToATLASti(
    project: any,
    options: { includeCodings?: boolean; includeMemos?: boolean } = {}
  ): string {
    const { includeCodings = true, includeMemos = false } = options;

    let output = `____________________________________________________
ATLAS.ti Project Export
Generated by EVIDENRA Professional
Date: ${new Date().toLocaleString('de-DE')}
____________________________________________________

PROJECT: ${project.name}

DOCUMENTS: ${project.documents?.length || 0}
CODES: ${project.categories?.length || 0}
QUOTATIONS: ${project.codings?.length || 0}

____________________________________________________
DOCUMENTS
____________________________________________________

`;

    // Export documents
    project.documents?.forEach((doc: any, index: number) => {
      output += `\n[DOCUMENT ${index + 1}]\n`;
      output += `Name: ${doc.name}\n`;
      output += `Words: ${doc.wordCount || 0}\n`;
      output += `Date Added: ${doc.dateAdded || 'N/A'}\n`;
      output += `\nContent:\n`;
      output += `${doc.content}\n`;
      output += `\n${'='.repeat(60)}\n`;
    });

    // Export code system (categories)
    output += `\n____________________________________________________
CODE SYSTEM
____________________________________________________\n\n`;

    project.categories?.forEach((cat: any, index: number) => {
      const codingCount = project.codings?.filter((c: any) =>
        c.categoryId === cat.id || c.category === cat.name
      ).length || 0;

      output += `[CODE ${index + 1}]\n`;
      output += `Name: ${cat.name}\n`;
      output += `Description: ${cat.description || 'No description'}\n`;
      output += `Frequency: ${codingCount}\n`;
      output += `Color: ${cat.color || 'Default'}\n\n`;
    });

    // Export quotations (codings) if requested
    if (includeCodings) {
      output += `\n____________________________________________________
QUOTATIONS (Coded Segments)
____________________________________________________\n\n`;

      project.codings?.forEach((coding: any, index: number) => {
        const doc = project.documents?.find((d: any) => d.id === coding.documentId);
        const cat = project.categories?.find((c: any) =>
          c.id === coding.categoryId || c.name === coding.category
        );

        output += `[QUOTATION ${index + 1}]\n`;
        output += `Document: ${doc?.name || 'Unknown'}\n`;
        output += `Code: ${cat?.name || coding.category || 'Unknown'}\n`;
        output += `Text: "${coding.text}"\n`;
        if (coding.memo) {
          output += `Memo: ${coding.memo}\n`;
        }
        output += `\n`;
      });
    }

    output += `\n____________________________________________________
END OF EXPORT
____________________________________________________\n`;

    return output;
  }

  /**
   * Export to MAXQDA format (.txt with MAXQDA-specific structure)
   */
  static exportToMAXQDA(project: any): string {
    let output = `MAXQDA Project Export
Generated by EVIDENRA Professional
${new Date().toLocaleString('de-DE')}

Project Name: ${project.name}
Documents: ${project.documents?.length || 0}
Codes: ${project.categories?.length || 0}
Coded Segments: ${project.codings?.length || 0}

================================================================================
CODE SYSTEM
================================================================================

`;

    // Export code system in MAXQDA hierarchy format
    project.categories?.forEach((cat: any) => {
      const codingCount = project.codings?.filter((c: any) =>
        c.categoryId === cat.id || c.category === cat.name
      ).length || 0;

      output += `\\${cat.name}\n`;
      output += `  Description: ${cat.description || 'None'}\n`;
      output += `  Frequency: ${codingCount}\n\n`;
    });

    output += `\n================================================================================
DOCUMENTS
================================================================================\n\n`;

    // Export documents
    project.documents?.forEach((doc: any) => {
      output += `Document: ${doc.name}\n`;
      output += `${'='.repeat(80)}\n`;
      output += `${doc.content}\n\n`;

      // Find codings for this document
      const docCodings = project.codings?.filter((c: any) => c.documentId === doc.id) || [];

      if (docCodings.length > 0) {
        output += `\nCoded Segments in this document:\n`;
        output += `${'-'.repeat(80)}\n`;

        docCodings.forEach((coding: any) => {
          const cat = project.categories?.find((c: any) =>
            c.id === coding.categoryId || c.name === coding.category
          );
          output += `[${cat?.name || 'Unknown'}] "${coding.text}"\n`;
          if (coding.memo) {
            output += `  Memo: ${coding.memo}\n`;
          }
          output += `\n`;
        });
      }

      output += `\n${'='.repeat(80)}\n\n`;
    });

    return output;
  }

  /**
   * Export to SPSS format (.sav data or .csv with proper structure)
   * For SPSS, we export as CSV with metadata header
   */
  static exportToSPSS(project: any): string {
    // SPSS CSV format with metadata
    let output = `* SPSS Data File\n`;
    output += `* Generated by EVIDENRA Professional\n`;
    output += `* Date: ${new Date().toISOString()}\n`;
    output += `* Project: ${project.name}\n`;
    output += `*\n`;
    output += `* Variable Definitions:\n`;
    output += `* CodingID - Unique identifier for each coding\n`;
    output += `* DocumentID - Document identifier\n`;
    output += `* DocumentName - Name of the document\n`;
    output += `* CategoryID - Category identifier\n`;
    output += `* CategoryName - Name of the category\n`;
    output += `* CodingText - The coded text segment\n`;
    output += `* TextLength - Length of coded text\n`;
    output += `* Position - Position in document\n`;
    output += `* DateCoded - When the coding was created\n`;
    output += `*\n\n`;

    // CSV Header
    output += `CodingID,DocumentID,DocumentName,CategoryID,CategoryName,CodingText,TextLength,Position,DateCoded\n`;

    // Export codings as CSV rows
    project.codings?.forEach((coding: any, index: number) => {
      const doc = project.documents?.find((d: any) => d.id === coding.documentId);
      const cat = project.categories?.find((c: any) =>
        c.id === coding.categoryId || c.name === coding.category
      );

      const row = [
        index + 1, // CodingID
        coding.documentId || '',
        `"${(doc?.name || 'Unknown').replace(/"/g, '""')}"`, // Escape quotes
        coding.categoryId || '',
        `"${(cat?.name || coding.category || 'Unknown').replace(/"/g, '""')}"`,
        `"${(coding.text || '').replace(/"/g, '""').substring(0, 500)}"`, // Limit text length
        coding.text?.length || 0,
        coding.position || 0,
        coding.dateCreated || new Date().toISOString()
      ].join(',');

      output += row + '\n';
    });

    output += `\n* End of data\n`;
    output += `* Total codings: ${project.codings?.length || 0}\n`;

    return output;
  }

  /**
   * Export to NVivo format (similar to ATLAS.ti but with NVivo structure)
   */
  static exportToNVivo(project: any): string {
    let output = `NVivo Project Export
Generated by EVIDENRA Professional
${new Date().toLocaleString('de-DE')}

Project: ${project.name}

<Sources>
`;

    // Export sources (documents)
    project.documents?.forEach((doc: any) => {
      output += `  <Source Name="${doc.name}" Type="Text">\n`;
      output += `    <Content>${doc.content}</Content>\n`;
      output += `    <WordCount>${doc.wordCount || 0}</WordCount>\n`;
      output += `  </Source>\n`;
    });

    output += `</Sources>\n\n<Nodes>\n`;

    // Export nodes (categories/codes)
    project.categories?.forEach((cat: any) => {
      const codingCount = project.codings?.filter((c: any) =>
        c.categoryId === cat.id || c.category === cat.name
      ).length || 0;

      output += `  <Node Name="${cat.name}">\n`;
      output += `    <Description>${cat.description || ''}</Description>\n`;
      output += `    <References>${codingCount}</References>\n`;
      output += `  </Node>\n`;
    });

    output += `</Nodes>\n\n<Codings>\n`;

    // Export codings
    project.codings?.forEach((coding: any) => {
      const doc = project.documents?.find((d: any) => d.id === coding.documentId);
      const cat = project.categories?.find((c: any) =>
        c.id === coding.categoryId || c.name === coding.category
      );

      output += `  <Coding>\n`;
      output += `    <Source>${doc?.name || 'Unknown'}</Source>\n`;
      output += `    <Node>${cat?.name || 'Unknown'}</Node>\n`;
      output += `    <Text>${coding.text}</Text>\n`;
      output += `  </Coding>\n`;
    });

    output += `</Codings>\n`;

    return output;
  }

  /**
   * Universal export dispatcher
   */
  static async exportReport(
    content: string,
    format: 'html' | 'md' | 'atlas' | 'maxqda' | 'spss' | 'nvivo',
    filename: string,
    title?: string
  ): Promise<Blob> {
    let exportContent: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
      case 'html':
        exportContent = this.markdownToHTML(content, title || filename);
        mimeType = 'text/html';
        extension = '.html';
        break;
      case 'md':
        exportContent = content;
        mimeType = 'text/markdown';
        extension = '.md';
        break;
      case 'atlas':
      case 'maxqda':
      case 'spss':
      case 'nvivo':
        // These require project data, not just report content
        // Will be handled separately in App.tsx
        throw new Error(`Format ${format} requires project data`);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    return new Blob([exportContent], { type: mimeType });
  }
}
