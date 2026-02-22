# ✏️ Editor de Sessões Integrado ao Calendário

## 🎯 Nova Funcionalidade Adicionada!

Agora você tem um **Editor de Sessões** completo e visual integrado diretamente na aba de Calendário!

---

## 🚀 Como Acessar

1. Vá para a aba **📅 Calendário**
2. Clique no botão **✏️** (ícone de editar) ao lado da navegação do mês
3. O modal de edição abre automaticamente!

**Visual:**
```
┌──────────────────────────────────────┐
│ 🎯 Meta: [120] min    📅 Jan 2026 ✏️ ← │
│                           ◀ ▶        │
└──────────────────────────────────────┘
                              ↑
                        Clique aqui!
```

---

## ✨ Funcionalidades do Editor

### **⚡ Ações Rápidas** (No topo do modal)

#### 1. **📅 Mover Hoje → Ontem**
```
Move TODAS as sessões de hoje para ontem
```
**Quando usar:**
- Estudou de madrugada
- Quer que conte como o dia anterior
- 1 clique e pronto!

**Exemplo:**
```
ANTES:
13/02/2026 - 3 sessões

DEPOIS:
12/02/2026 - 3 sessões (movidas)
13/02/2026 - vazio
```

#### 2. **🌙 Corrigir Madrugada (00h-06h)**
```
Move automaticamente sessões entre 00:00 e 06:00 
para o dia anterior
```
**Quando usar:**
- Estudou de madrugada (1h, 2h, 3h...)
- Quer que conte como ontem
- Perfeito para corujas! 🦉

**Exemplo:**
```
ANTES:
13/02/2026 02:30 - Matemática
13/02/2026 14:00 - Física

DEPOIS:
12/02/2026 02:30 - Matemática (movida)
13/02/2026 14:00 - Física (permanece)
```

---

### **📋 Últimas 10 Sessões**

Mostra suas 10 sessões mais recentes com:
- 📅 **Data e hora** completas
- 📚 **Matéria**
- ⏱️ **Tempo estudado**
- 📝 **Questões** (acertos/total)

**Visual de Cada Card:**
```
┌──────────────────────────────────────┐
│ 12/02/2026 às 14:30              🗑️ │
│ Matemática                           │
├──────────────────────────────────────┤
│ ⏱️ Tempo: 120 min  📝 Questões: 45/50│
├──────────────────────────────────────┤
│ [⏱️ Editar] [📝 Editar] [📅 Mover]  │
│   Tempo      Questões     Data      │
└──────────────────────────────────────┘
```

---

## 🛠️ Ações por Sessão

### **1. ⏱️ Editar Tempo**
```
Clica → Digite novo tempo → Pronto!
```
**Exemplo:**
- Tempo atual: 25 min
- Clica em "Editar Tempo"
- Digite: 120
- Novo tempo: 120 min (2 horas)

### **2. 📝 Editar Questões**
```
Clica → Digite total → Digite acertos → Pronto!
```
**Exemplo:**
- Atual: 8/10 questões
- Clica em "Editar Questões"
- Digite total: 50
- Digite acertos: 45
- Novo: 45/50 questões

### **3. 📅 Mover Data**
```
Clica → Digite quantos dias para trás → Pronto!
```
**Exemplo:**
- Data atual: 13/02/2026
- Clica em "Mover Data"
- Digite: 1 (dia)
- Nova data: 12/02/2026

**Outros exemplos:**
- Digite 2 = Move para 2 dias atrás (anteontem)
- Digite 7 = Move para 1 semana atrás

### **4. 🗑️ Deletar Sessão**
```
Clica no ícone da lixeira → Confirma → Deletado!
```
**Atenção:** Ação irreversível! Pede confirmação.

---

## 📖 Guia de Uso - Casos Reais

### **Caso 1: Estudei de Madrugada (Mais Comum)**

**Situação:**
- São 02:00 da manhã
- Você acabou de estudar 2 horas
- Sistema registrou como "hoje"
- Mas você quer que conte como "ontem"

**Solução Rápida:**
1. Abra o editor (botão ✏️)
2. Clique em **"🌙 Corrigir Madrugada"**
3. Pronto! Automaticamente movido

**OU Solução Manual:**
1. Abra o editor
2. Encontre a sessão (ex: 13/02/2026 02:30)
3. Clique em **"📅 Mover Data"**
4. Digite: **1**
5. Nova data: 12/02/2026 02:30

---

### **Caso 2: Estudei Mais Que Registrei**

**Situação:**
- Registrou: 25 min
- Estudou na real: 2 horas (120 min)

**Solução:**
1. Abra o editor
2. Encontre a sessão
3. Clique em **"⏱️ Editar Tempo"**
4. Digite: **120**
5. Salvo!

---

### **Caso 3: Fiz Mais Questões**

**Situação:**
- Registrou: 10 questões, 8 acertos
- Fez na real: 50 questões, 45 acertos

**Solução:**
1. Abra o editor
2. Encontre a sessão
3. Clique em **"📝 Editar Questões"**
4. Digite total: **50**
5. Digite acertos: **45**
6. Salvo!

---

### **Caso 4: Mover Todas de Hoje para Ontem**

**Situação:**
- Esqueceu de registrar ontem
- Registrou tudo "hoje"
- Quer mover tudo para "ontem"

**Solução:**
1. Abra o editor
2. Clique em **"📅 Mover Hoje → Ontem"**
3. Confirme
4. Todas movidas!

---

### **Caso 5: Deletar Sessão Duplicada**

**Situação:**
- Registrou a mesma sessão 2x por engano
- Quer deletar a duplicata

**Solução:**
1. Abra o editor
2. Encontre a sessão duplicada
3. Clique no **🗑️**
4. Confirme
5. Deletada!

---

## 🎨 Interface Completa

```
┌─────────────────────────────────────────────────┐
│              ✏️ Editor de Sessões           ×   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ⚡ Ações Rápidas                               │
│  ┌──────────────────┬──────────────────┐       │
│  │📅 Mover Hoje →  │🌙 Corrigir       │       │
│  │   Ontem          │   Madrugada      │       │
│  └──────────────────┴──────────────────┘       │
│                                                 │
│  ────────────────────────────────────────       │
│                                                 │
│  📋 Últimas 10 Sessões                          │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 12/02/2026 às 14:30                   🗑️ │ │
│  │ Matemática                                │ │
│  ├───────────────────────────────────────────┤ │
│  │ ⏱️ Tempo: 120 min  📝 Questões: 45/50    │ │
│  ├───────────────────────────────────────────┤ │
│  │ [⏱️ Editar] [📝 Editar] [📅 Mover Data]  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ 13/02/2026 às 02:30                   🗑️ │ │
│  │ Física                                    │ │
│  ├───────────────────────────────────────────┤ │
│  │ ⏱️ Tempo: 90 min   📝 Questões: 28/30    │ │
│  ├───────────────────────────────────────────┤ │
│  │ [⏱️ Editar] [📝 Editar] [📅 Mover Data]  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [mais 8 sessões...]                           │
│                                                 │
├─────────────────────────────────────────────────┤
│                                    [Fechar]     │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Arquivos Modificados

### **1. components/Calendar.tsx**
**Adicionado:**
- Estado `showEditModal` para controlar modal
- Estado `editingSessions` para armazenar sessões
- Funções de edição:
  - `openEditModal()` - Abre modal
  - `moveSessionToDate()` - Move sessão
  - `editSessionQuestions()` - Edita questões
  - `editSessionTime()` - Edita tempo
  - `deleteSession()` - Deleta sessão
  - `fixEarlyMorningSessions()` - Corrige madrugada
  - `moveAllTodayToYesterday()` - Move todas
- Botão ✏️ no header
- Modal completo de edição
- Import de ícones (Edit2, Trash2, ArrowLeft, ArrowRight)

### **2. components/CustomStyles.tsx**
**Adicionado (~130 linhas):**
- Seção "EDITOR DE SESSÕES NO CALENDÁRIO"
- Estilos para botão `.btn-edit-sessions`
- Estilos para modal `.session-editor-modal`
- Cards de sessão `.session-edit-card`
- Ações rápidas `.quick-actions-section`
- Botões de ação `.btn-action-small`
- Botão deletar `.btn-danger-small`
- Estatísticas `.session-edit-stats`

---

## ⚙️ Tecnicamente

### **Persistência:**
- Todas as mudanças salvam no **localStorage**
- Chave: `study-sessions`
- Formato: Array de objetos Session

### **Recarregamento:**
- Página recarrega automaticamente após cada edição
- Garante que dados estão sincronizados
- Calendário atualiza instantaneamente

### **Segurança:**
- Confirmação ao deletar sessões
- Validação de números em inputs
- Índices corretos mantidos

### **Performance:**
- Mostra apenas últimas 10 sessões no editor
- Evita sobrecarga com muitos dados
- Carregamento rápido do modal

---

## 💡 Dicas Profissionais

### **1. Backup Antes de Editar**
```javascript
// No console (F12)
const backup = localStorage.getItem('study-sessions');
console.log('BACKUP:', backup);
// Copie e salve em algum lugar
```

### **2. Restaurar Backup**
```javascript
localStorage.setItem('study-sessions', 'SEU_BACKUP_AQUI');
location.reload();
```

### **3. Ver Todas as Sessões (Console)**
```javascript
const sessions = JSON.parse(localStorage.getItem('study-sessions'));
console.table(sessions);
```

### **4. Limpar Tudo (Resetar)**
```javascript
localStorage.removeItem('study-sessions');
location.reload();
```

---

## ✅ Benefícios

### **Antes (Console):**
```javascript
// Tinha que fazer isso no console:
let sessions = JSON.parse(localStorage.getItem('study-sessions'));
sessions[0].duration = 120;
localStorage.setItem('study-sessions', JSON.stringify(sessions));
location.reload();
```

### **Agora (Interface):**
```
1. Clica no botão ✏️
2. Clica em "Editar Tempo"
3. Digite: 120
4. Pronto!
```

**Muito mais fácil!** 🎉

---

## 🎨 Responsividade

O modal se adapta a diferentes telas:

**Desktop:**
- Largura máxima: 800px
- Todas colunas visíveis
- Scroll suave

**Mobile:**
- Largura: 90%
- Botões empilham em grid
- Touch-friendly

---

## 🔥 Casos de Uso Especiais

### **Estudante Noturno:**
```
Estuda sempre de madrugada (01h-04h)
→ Use: "Corrigir Madrugada" toda manhã
```

### **Forgot to Register:**
```
Esqueceu de registrar ontem
→ Use: "Mover Hoje → Ontem"
```

### **Wrong Data:**
```
Registrou errado
→ Use: Editar específico
```

### **Duplicates:**
```
Sessões duplicadas
→ Use: Deletar
```

---

## 🎯 Conclusão

Agora você tem **controle total** sobre suas sessões de estudo:
- ✅ Editar tempo
- ✅ Editar questões
- ✅ Mover entre dias
- ✅ Deletar sessões
- ✅ Corrigir madrugada automaticamente
- ✅ Interface visual intuitiva
- ✅ Sem precisar usar console!

**Tudo integrado e fácil de usar!** 🚀

---

**Versão**: 3.2 - Editor de Sessões Integrado
**Data**: Fevereiro 2026
**Status**: ✅ Implementado e Funcional
