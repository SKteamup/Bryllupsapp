import React, {
  useState, useEffect, useCallback, useMemo, useRef
} from "react";
import { supabase } from './supabaseClient';
/* ═══════════════════════════════════════════════════════════
   DESIGN SYSTEM — CSS
═══════════════════════════════════════════════════════════ */
const CSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { -webkit-text-size-adjust: 100%; height: 100%; }
    body { height: 100%; overscroll-behavior: none; background: #FAF8F4; }
    * { -webkit-tap-highlight-color: transparent; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: #E8E4DE; border-radius: 2px; }

    :root {
      --ivory:#FAF8F4; --white:#FFFFFE; --stone:#F2EDE6;
      --border:#E4DDD4; --border2:#D6CEC4;
      --text:#3A3028; --muted:#8C8078; --faint:#BEB6AE;
      --bronze:#B8896A; --bronze2:#9A6E50; --bronzeL:#F5ECE3;
      --sage:#6A8A72; --sageL:#EAF2EC;
      --green:#4A7C5C; --greenL:#E8F3ED;
      --amber:#C4803A; --amberL:#FEF0E2;
      --red:#B04030; --redL:#FCECEA;
      --blue:#4A6E8A; --blueL:#E4EEF5;
      --sidebar:260px; --nav-h:56px;
      --safe-b:env(safe-area-inset-bottom,0px);
      --safe-t:env(safe-area-inset-top,0px);
      --radius:12px;
      --px:16px;
    }
    @media(min-width:480px){ :root{ --px:20px; } }
    @media(min-width:900px){ :root{ --px:32px; } }
    @media(min-width:1280px){ :root{ --px:48px; } }

    /* ── ANIMATIONS ── */
    @keyframes fadeUp  {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
    @keyframes slideUp {from{transform:translateY(100%)}to{transform:translateY(0)}}
    @keyframes pulse   {0%,100%{opacity:1}50%{opacity:.45}}
    @keyframes shimmer {0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}
    .fade-up{animation:fadeUp .26s cubic-bezier(.32,.72,0,1) both}
    .fade-in{animation:fadeIn .2s ease both}

    /* ── ROOT ── */
    #root {
      font-family:'Inter',system-ui,sans-serif;
      font-size:14px; line-height:1.5;
      color:var(--text); background:var(--ivory);
      height:100dvh; display:flex; overflow:hidden;
    }

    /* ── SIDEBAR — desktop only ── */
    .sidebar{width:var(--sidebar);flex-shrink:0;background:#3A3028;height:100dvh;display:none;flex-direction:column;overflow:hidden}
    @media(min-width:900px){
      .sidebar{display:flex}
      .bottom-nav{display:none!important}
      .top-bar{display:none!important}
      .app-content{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}
      .scroll-area{flex:1;min-height:0;overflow-y:auto}
      .page-wrap{padding:0 var(--px) 64px;max-width:900px}
      .page-header{padding-top:40px}
      .h1{font-size:36px}
      .stat-grid{grid-template-columns:repeat(4,1fr)}
      .grid-3{grid-template-columns:1fr 1fr 1fr}
    }
    @media(min-width:1280px){.page-wrap{max-width:1040px} .h1{font-size:42px}}

    .sb-logo{padding:22px 24px 16px;border-bottom:1px solid rgba(255,255,255,.07)}
    .sb-logo-mark{font-family:'Playfair Display',serif;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:4px}
    .sb-logo-name{font-family:'Playfair Display',serif;font-size:18px;font-weight:500;color:rgba(255,255,255,.9)}
    .sb-section{padding:16px 0 4px 24px;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.25);font-weight:600}
    .sb-item{display:flex;align-items:center;gap:12px;padding:10px 24px;cursor:pointer;color:rgba(255,255,255,.48);font-size:13px;border-left:2px solid transparent;transition:all .15s}
    .sb-item:hover{color:rgba(255,255,255,.78);background:rgba(255,255,255,.04)}
    .sb-item.active{color:var(--bronze);border-left-color:var(--bronze);background:rgba(184,149,106,.08)}
    .sb-item-icon{width:16px;text-align:center;flex-shrink:0;font-size:14px}
    .sb-badge{margin-left:auto;background:var(--red);color:#fff;border-radius:10px;font-size:9px;font-weight:600;padding:2px 6px}
    .sb-footer{margin-top:auto;padding:16px 24px;border-top:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:10px}
    .sb-avatar{width:34px;height:34px;border-radius:50%;background:var(--bronze);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:14px;color:white;flex-shrink:0}
    .sb-user-name{font-size:12px;color:rgba(255,255,255,.7);font-weight:500}
    .sb-user-role{font-size:10px;color:rgba(255,255,255,.3);margin-top:1px}

    /* ── APP CONTENT ── */
    .app-content{flex:1;min-width:0;display:flex;flex-direction:column;position:relative;overflow:hidden}
    .scroll-area{flex:1;min-height:0;overflow-y:auto;overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch}
    .scroll-area.full-h{overflow:hidden;display:flex;flex-direction:column}

    /* ── TOP BAR ── */
    .top-bar{flex-shrink:0;background:rgba(250,248,244,.97);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:10px var(--px);padding-top:calc(10px + var(--safe-t));display:flex;justify-content:space-between;align-items:center;z-index:40;min-height:52px}
    .tb-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:500;color:var(--text)}
    .tb-sub{font-size:10px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-top:1px}
    .tb-avatar{width:32px;height:32px;border-radius:50%;background:var(--bronze);display:flex;align-items:center;justify-content:center;font-size:13px;color:white;font-family:'Playfair Display',serif}

    /* ── BOTTOM NAV ── */
    .bottom-nav{flex-shrink:0;height:calc(var(--nav-h) + var(--safe-b));padding-bottom:var(--safe-b);background:var(--ivory);border-top:1px solid var(--border);display:flex;z-index:40}
    .bn-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;color:var(--faint);font-size:9px;letter-spacing:.06em;text-transform:uppercase;font-family:'Inter',sans-serif;font-weight:500;transition:color .15s;position:relative;padding:4px 2px}
    .bn-item.active{color:var(--bronze)}
    .bn-item.active::before{content:'';position:absolute;top:0;left:20%;right:20%;height:2px;background:var(--bronze);border-radius:0 0 2px 2px}
    .bn-icon{font-size:18px;line-height:1}
    .bn-badge{position:absolute;top:4px;right:calc(50% - 16px);width:14px;height:14px;background:var(--red);color:white;border-radius:50%;font-size:8px;display:flex;align-items:center;justify-content:center;font-weight:700;border:1.5px solid var(--white)}
    @media(min-width:480px){.bn-icon{font-size:20px}.bn-item{font-size:10px}}

    /* ── PAGE ── */
    .page-wrap{padding:0 var(--px) 48px}
    .page-header{padding:20px 0 16px}
    .page-kicker{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--bronze);font-weight:600;margin-bottom:6px}

    /* Fluid headings */
    .h1{font-family:'Playfair Display',serif;font-size:26px;font-weight:600;letter-spacing:-.02em;line-height:1.1;color:var(--text)}
    .h2{font-family:'Playfair Display',serif;font-size:20px;font-weight:500;letter-spacing:-.01em;color:var(--text)}
    .h3{font-family:'Playfair Display',serif;font-size:16px;font-weight:500;color:var(--text)}
    @media(min-width:480px){.h1{font-size:28px}.h2{font-size:22px}}
    @media(min-width:640px){.h1{font-size:32px}}

    .p-muted{font-size:12px;color:var(--muted);margin-top:3px}
    .label{display:block;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;font-weight:600}
    .divider{height:1px;background:var(--border);margin:16px 0}

    /* ── CARDS ── */
    .card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:10px}
    .card-flush{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:10px}
    .card-stone{background:var(--stone);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:10px}
    .card-dark{background:#3A3028;border:none;border-radius:var(--radius);padding:16px;margin-bottom:10px;color:white}
    .card-bronze{background:var(--bronzeL);border:1px solid rgba(184,149,106,.25);border-radius:var(--radius);padding:14px;margin-bottom:10px}
    @media(min-width:900px){.card{padding:20px}.card-dark{padding:22px}}

    /* ── STAT GRID ── */
    .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}
    .stat-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:14px}
    .stat-card.accent{border-top:2px solid var(--bronze)}
    .stat-n{font-family:'Playfair Display',serif;font-size:22px;font-weight:500;line-height:1;color:var(--text)}
    .stat-l{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-top:4px}
    .stat-sub{font-size:11px;color:var(--muted);margin-top:3px;line-height:1.4}
    @media(min-width:900px){.stat-n{font-size:26px}.stat-card{padding:18px}}

    /* ── PROGRESS ── */
    .prog-bar{height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin-top:10px}
    .prog-fill{height:100%;border-radius:2px;transition:width .6s ease}

    /* ── BUTTONS ── */
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 18px;border-radius:10px;border:none;cursor:pointer;font-size:13px;font-family:'Inter',sans-serif;font-weight:600;letter-spacing:.02em;transition:transform .1s,opacity .15s;min-height:44px;white-space:nowrap;-webkit-user-select:none;user-select:none}
    .btn:active{transform:scale(.97)}
    @media(min-width:900px){.btn:hover{opacity:.88}}
    .btn-primary{background:#3A3028;color:white}
    .btn-bronze{background:var(--bronze);color:white}
    .btn-outline{background:transparent;border:1.5px solid var(--border);color:var(--text)}
    .btn-ghost{background:transparent;color:var(--text);border:none}
    .btn-red{background:var(--red);color:white}
    .btn-full{width:100%}
    .btn-sm{min-height:36px;padding:7px 13px;font-size:12px;border-radius:9px}
    .btn-xs{min-height:28px;padding:5px 10px;font-size:11px;border-radius:7px}

    /* ── INPUTS ── */
    .inp{width:100%;padding:11px 13px;border-radius:9px;border:1.5px solid var(--border);background:var(--white);font-size:14px;font-family:'Inter',sans-serif;color:var(--text);outline:none;transition:border-color .2s,box-shadow .2s;min-height:44px}
    .inp:focus{border-color:var(--bronze);box-shadow:0 0 0 3px rgba(184,149,106,.12)}
    .inp-wrap{margin-bottom:14px}
    textarea.inp{resize:vertical;min-height:80px}
    select.inp{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238A8480' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 13px center;padding-right:34px}

    /* ── TAGS ── */
    .tag{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:600;letter-spacing:.06em;white-space:nowrap}
    .tag-bronze{background:var(--bronzeL);color:var(--bronze2)}
    .tag-green{background:var(--greenL);color:var(--green)}
    .tag-amber{background:var(--amberL);color:var(--amber)}
    .tag-red{background:var(--redL);color:var(--red)}
    .tag-blue{background:var(--blueL);color:var(--blue)}
    .tag-muted{background:var(--stone);color:var(--muted)}

    /* ── CHIPS ── */
    .chips{display:flex;gap:6px;overflow-x:auto;margin-bottom:16px;padding-bottom:2px;scrollbar-width:none}
    .chips::-webkit-scrollbar{display:none}
    .chip{flex-shrink:0;padding:6px 13px;border-radius:20px;border:1.5px solid var(--border);background:var(--white);font-size:11px;font-family:'Inter',sans-serif;font-weight:500;cursor:pointer;color:var(--muted);transition:all .15s;white-space:nowrap}
    .chip:active{transform:scale(.97)}
    .chip.on{background:var(--text);color:white;border-color:var(--text)}

    /* ── ROWS ── */
    .row-item{display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--border);cursor:pointer}
    .row-item:last-child{border-bottom:none}
    .row-item:active{opacity:.7}
    .row-chevron{color:var(--faint);font-size:14px;flex-shrink:0;margin-left:auto}

    /* ── AVATAR ── */
    .avatar{width:38px;height:38px;border-radius:50%;background:var(--stone);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:15px;color:var(--muted);flex-shrink:0}
    .avatar-bronze{background:var(--bronzeL);color:var(--bronze2);border-color:rgba(184,149,106,.3)}

    /* ── SHEET / MODAL ── */
    .sheet-overlay{position:fixed;inset:0;background:rgba(50,40,32,.45);z-index:200;display:flex;flex-direction:column;justify-content:flex-end;animation:fadeIn .2s ease}
    .sheet{background:var(--white);border-radius:20px 20px 0 0;padding:0 var(--px) calc(28px + var(--safe-b));max-height:92dvh;overflow-y:auto;animation:slideUp .28s cubic-bezier(.32,.72,0,1)}
    .sheet-handle{width:36px;height:4px;background:var(--border);border-radius:2px;margin:12px auto 20px}
    .sheet-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:500;margin-bottom:18px;color:var(--text)}
    @media(min-width:640px){
      .sheet-overlay{align-items:center;justify-content:center;padding:20px}
      .sheet{border-radius:16px;max-width:520px;width:100%;max-height:88vh;padding:0 28px 32px;animation:fadeUp .22s ease}
      .sheet-handle{display:none}
    }

    /* ── TOAST ── */
    .toast{position:fixed;bottom:calc(var(--nav-h) + var(--safe-b) + 12px);left:var(--px);right:var(--px);background:#3A3028;color:white;border-radius:10px;padding:13px 16px;display:flex;align-items:center;gap:10px;font-size:13px;z-index:500;box-shadow:0 8px 24px rgba(0,0,0,.2);animation:fadeUp .25s ease}
    @media(min-width:640px){.toast{max-width:400px;left:50%;transform:translateX(-50%);right:auto}}
    @media(min-width:900px){.toast{left:calc(var(--sidebar) + 20px);transform:none;right:auto;bottom:24px}}

    /* ── EMPTY STATE ── */
    .empty{text-align:center;padding:48px 20px}
    .empty-icon{font-size:32px;color:var(--faint);margin-bottom:14px;font-family:'Playfair Display',serif;font-style:italic}
    .empty-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:500;color:var(--text);margin-bottom:8px}
    .empty-sub{font-size:13px;color:var(--muted);line-height:1.6;max-width:280px;margin:0 auto 22px}

    /* ── GRIDS ── */
    .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}
    .grid-3{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}
    @media(min-width:900px){.grid-3{grid-template-columns:1fr 1fr 1fr}}

    /* ── DASHBOARD ── */
    .insight-card{background:#3A3028;border-radius:var(--radius);padding:16px;margin-bottom:10px;color:white}
    @media(min-width:900px){.insight-card{padding:22px}}
    .insight-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px}
    .countdown-grid{display:grid;grid-template-columns:repeat(4,1fr)}
    .cd-cell{text-align:center;padding:12px 4px;border-right:1px solid rgba(255,255,255,.07)}
    .cd-cell:last-child{border-right:none}
    .cd-n{font-family:'Playfair Display',serif;font-size:24px;font-weight:500;color:var(--bronze);line-height:1}
    .cd-l{font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-top:3px}
    @media(min-width:480px){.cd-n{font-size:28px}.cd-cell{padding:14px 6px}}
    .next-step-item{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)}
    .next-step-item:last-child{border-bottom:none}
    .ns-dot{width:18px;height:18px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;margin-top:1px}
    .ns-dot.urgent{border-color:var(--amber)}

    /* ── VENDOR ── */
    .vs-researching{color:var(--muted)} .vs-contacted{color:var(--blue)} .vs-quote{color:var(--amber)} .vs-shortlisted{color:var(--bronze)} .vs-booked{color:var(--green)} .vs-rejected{color:var(--red)}
    .vendor-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:8px}

    /* ── TASKS ── */
    .task-row{display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid var(--border)}
    .task-row:last-child{border-bottom:none}
    .task-check{width:20px;height:20px;border-radius:5px;border:2px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s}
    .task-check.done{background:var(--green);border-color:var(--green)}
    .task-check.urgent{border-color:var(--amber)}

    /* ── BUDGET ── */
    .budget-row{padding:14px 0;border-bottom:1px solid var(--border)}
    .budget-row:last-child{border-bottom:none}

    /* ── SEATING ── */
    .seating-canvas{position:relative;overflow:hidden;touch-action:none;user-select:none;cursor:default;background:radial-gradient(circle,rgba(184,149,106,.1) 1.5px,transparent 1.5px);background-size:28px 28px;background-color:#F8F5F0}
    .table-node{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:50%;cursor:grab;touch-action:none;user-select:none;box-shadow:0 2px 12px rgba(0,0,0,.1);transition:box-shadow .15s}
    .table-node.selected{box-shadow:0 0 0 3px var(--bronze),0 4px 20px rgba(0,0,0,.15);z-index:10}
    .table-node:active{cursor:grabbing}
    .tn-num{font-family:'Playfair Display',serif;font-size:17px;font-weight:500;line-height:1;pointer-events:none}
    .tn-cap{font-size:9px;color:var(--muted);margin-top:2px;pointer-events:none}

    /* ── AI CHAT ── */
    .chat-bubble-ai{background:var(--stone);border-radius:14px 14px 14px 4px;padding:12px 14px;max-width:88%;font-size:14px;line-height:1.65}
    .chat-bubble-user{background:var(--text);color:white;border-radius:14px 14px 4px 14px;padding:12px 14px;max-width:88%;font-size:14px;line-height:1.65}

    /* ── PLAN HERO ── */
    .plan-hero{background:#3A3028;padding:16px var(--px);margin-bottom:14px}
    .ph-date{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:4px}
    .ph-name{font-family:'Playfair Display',serif;font-size:20px;font-weight:500;color:white;margin-bottom:2px}
    .ph-venue{font-size:12px;color:rgba(255,255,255,.45)}
    @media(min-width:480px){.ph-name{font-size:22px}}

    /* ── MISC ── */
    .check-item{display:flex;align-items:flex-start;gap:12px;padding:11px 0;border-bottom:1px solid var(--border)}
    .check-item:last-child{border-bottom:none}
    .live-dot{width:7px;height:7px;border-radius:50%;background:#4CAF50;flex-shrink:0;animation:pulse 2s infinite}
    .section-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
    .link-text{font-size:12px;color:var(--bronze);font-weight:600;cursor:pointer}
    .text-muted{color:var(--muted)} .text-bronze{color:var(--bronze)} .text-green{color:var(--green)} .text-red{color:var(--red)} .text-amber{color:var(--amber)}
    .mt4{margin-top:4px} .mt8{margin-top:8px} .mt12{margin-top:12px} .mt16{margin-top:16px} .mt24{margin-top:24px}
    .mb4{margin-bottom:4px} .mb8{margin-bottom:8px} .mb12{margin-bottom:12px}
    .fw600{font-weight:600} .fs11{font-size:11px} .fs12{font-size:12px} .fs13{font-size:13px}

    /* ── ONBOARDING ── */
    .onb-root{min-height:100dvh;background:var(--ivory);display:flex;flex-direction:column;max-width:520px;margin:0 auto;width:100%}
    .onb-header{background:var(--text);padding:20px var(--px) 0;flex-shrink:0}
    .onb-wordmark{font-family:'Playfair Display',serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:18px}
    .onb-progress{display:flex;gap:4px}
    .onb-prog-seg{flex:1;height:2px;border-radius:1px;transition:background .3s}
    .onb-body{flex:1;padding:24px var(--px) 16px;overflow-y:auto}
    .onb-footer{padding:14px var(--px);padding-bottom:calc(14px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--border);background:var(--white);display:flex;gap:10px}
    .onb-step-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:600;letter-spacing:-.02em;line-height:1.15;color:var(--text);margin-bottom:6px}
    .onb-step-sub{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:22px}
    @media(min-width:480px){.onb-step-title{font-size:28px}}

    /* ── OPTION BUTTON ── */
    .opt-btn{width:100%;display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:10px;border:1.5px solid var(--border);background:var(--white);cursor:pointer;text-align:left;transition:all .15s;margin-bottom:8px;font-family:'Inter',sans-serif}
    .opt-btn:active{transform:scale(.98)}
    .opt-btn.on{border-color:var(--bronze);background:var(--bronzeL)}
    .opt-dot{width:20px;height:20px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s}
    .opt-dot.on{background:var(--bronze);border-color:var(--bronze)}
    .opt-label{font-size:14px;font-weight:500;color:var(--text)}
    .opt-sub{font-size:11px;color:var(--muted);margin-top:2px}
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   CONSTANTS & DATA
═══════════════════════════════════════════════════════════ */
const TASK_CATS = ["Lokale","Mat & drikke","Foto / video","Blomster / dekor","Antrekk","Gjester","Invitasjoner","Bordplassering","Transport","Seremoni","Administrativt","Annet"];
const VENDOR_CATS = ["Lokale","Fotograf","Videograf","Catering","Blomster","Dekor","Klær","Hår & makeup","Musikk / DJ","Transport","Kake","Planlegger","Annet"];
const BUDGET_CATS = ["Lokale","Mat & drikke","Foto / video","Blomster & dekor","Klær & styling","Musikk","Transport","Seremoni","Kake","Diverse","Buffer"];
const INITIAL_GIFTS = [
  {id:1,  icon:"✈️", name:"Bidrag til bryllupsreise",       price:500,  takenBy:null, url:"",  notes:"Vi setter all pris på bidrag til bryllupsreisen vår til Toscana!"},
  {id:2,  icon:"🍳", name:"Le Creuset stekepanne",          price:1290, takenBy:null, url:"https://lecreuset.no", notes:"28 cm, sort eller blå"},
  {id:3,  icon:"🛁", name:"Spa-opphold for to",             price:2400, takenBy:null, url:"", notes:"f.eks. Bærums Verk Spa"},
  {id:4,  icon:"📷", name:"Fotobok fra bryllupet",          price:890,  takenBy:null, url:"", notes:"Trykk via Cheerz eller Chatbooks"},
  {id:5,  icon:"🕯️", name:"Diptyque duftlys sett",          price:650,  takenBy:null, url:"", notes:""},
  {id:6,  icon:"🍾", name:"Champagnepakke (6 flasker)",     price:1800, takenBy:null, url:"", notes:"Moët & Chandon eller tilsvarende"},
  {id:7,  icon:"🌿", name:"Plante og potte fra Plantagen",  price:480,  takenBy:null, url:"", notes:"Stor stueplante"},
  {id:8,  icon:"🎨", name:"Kunsttrykk for hjemmet",         price:1200, takenBy:null, url:"", notes:""},
];

const INITIAL_PHOTOS = [
  {id:1, by:"Marte H.",  emoji:"💐", color:"#f5e8e8", caption:"Gleder meg så mye!"},
  {id:2, by:"Lars H.",   emoji:"🥂", color:"#f0ede4", caption:"Skål for dere!"},
  {id:3, by:"Emma L.",   emoji:"💍", color:"#e8f0e8", caption:"Endelig!"},
  {id:4, by:"Jonas S.",  emoji:"📸", color:"#e8eaf5", caption:""},
];

const INITIAL_SONGS = [
  {id:1, title:"Can't Help Falling in Love", artist:"Elvis Presley",   by:"Marte H."},
  {id:2, title:"Dancing Queen",              artist:"ABBA",            by:"Lars H."},
  {id:3, title:"A Thousand Years",           artist:"Christina Perri", by:"Emma L."},
  {id:4, title:"Perfect",                    artist:"Ed Sheeran",      by:"Jonas S."},
];

const INITIAL_GUESTBOOK = [
  {id:1, name:"Marte Haugen",     emoji:"💕", msg:"Dere passer så godt sammen — ønsker dere all verdens lykke!"},
  {id:2, name:"Lars Kristiansen", emoji:"🎊", msg:"Gratulerer! Masse kjærlighet og gode opplevelser i fremtiden!"},
];

const INITIAL_BOOKINGS = [
  {id:"shuttle", icon:"🚌", name:"Shuttlebuss t/r",      desc:"Oslo S → Lysebu kl 13:00 og 13:30, retur ca 01:30",            price:"Gratis",       slots:40, taken:28, bookedBy:[]},
  {id:"hotel",   icon:"🏨", name:"Overnatting Lysebu",   desc:"Dobbeltrom inkl. frokost — spesialpris for bryllupsgjester",   price:"1 890 kr/natt",slots:15, taken:9,  bookedBy:[]},
  {id:"wine",    icon:"🍷", name:"Vinpakke til middagen", desc:"3 glass utvalgte viner til forrett, hoved og dessert",          price:"390 kr/pers",  slots:99, taken:0,  bookedBy:[]},
];

/* ─── VENDOR CATALOG ──────────────────────────────── */
const VENDOR_CATEGORIES_FULL = [
  {id:"lokale",    label:"Lokale",          icon:"🏛",  color:"#F0EDE8", desc:"Slott, hotell, gård, villa og mer"},
  {id:"fotograf",  label:"Fotograf",         icon:"📷",  color:"#E8EDF5", desc:"Dokumentarisk, romantisk, editoriell"},
  {id:"video",     label:"Video",            icon:"🎬",  color:"#EDE8F5", desc:"Bryllupsfilm, highlight, fullfilm"},
  {id:"catering",  label:"Catering",         icon:"🍽",  color:"#F0F5E8", desc:"Meny, buffet, food truck, bartender"},
  {id:"kake",      label:"Kake",             icon:"🎂",  color:"#F5EDE8", desc:"Bryllupskake, cupcakes, dessertbord"},
  {id:"blomster",  label:"Blomster & dekor", icon:"💐",  color:"#F5E8EE", desc:"Buketter, borddekor, seremoni"},
  {id:"musikk",    label:"DJ & musikk",      icon:"🎵",  color:"#E8F0F5", desc:"DJ, liveband, kvartet, jazzensemble"},
  {id:"hår",       label:"Hår & makeup",     icon:"💄",  color:"#F5E8F0", desc:"Brudestylist, testtime, mobile artists"},
  {id:"kjole",     label:"Kjole & dress",    icon:"👗",  color:"#EEE8F5", desc:"Brudesalong, tilpasning, utleie"},
  {id:"transport", label:"Transport",        icon:"🚗",  color:"#E8F5EE", desc:"Limousin, veteranbil, buss, helikopter"},
  {id:"planlegger",label:"Koordinator",      icon:"📋",  color:"#F5F0E8", desc:"Wedding planner, day-of koordinator"},
  {id:"annet",     label:"Annet",            icon:"✦",   color:"#EDEDEE", desc:"Underholdning, lysshow, fotoboks m.m."},
];

const DEMO_VENDOR_CATALOG = [
  {id:"v101",cat:"lokale",    name:"Lysebu Hotell",           city:"Oslo",     price:85000, priceLabel:"fra 70 000 kr", rating:4.9,reviews:124, verified:true, featured:true,  fast:true,  style:["klassisk","romantisk"], cap:120, desc:"Sagnomsust konferansehotell med storslått utsikt over Oslo og Nordmarka. Perfekt for det store bryllupet.", tags:["Innendørs","Hage","Overnatting","Parkering"], gallery:["#F5EDD8","#EDE4D0","#D8CCB8"], status:"exploring", portfolio:[{"id": "p1", "title": "Storsal & seremoni", "tag": "Lokale", "imgs": [{"c": "#E8DDD0", "e": "🏛", "cap": "Storsalen pyntet til seremoni"}, {"c": "#D8CCB8", "e": "💐", "cap": "Blomsterdekorasjon"}, {"c": "#C8BFB0", "e": "🕯️", "cap": "Intimt lysambiance"}, {"c": "#E8E4DC", "e": "🥂", "cap": "Cocktailreception hagen"}]}, {"id": "p2", "title": "Overnatting & suite", "tag": "Opphold", "imgs": [{"c": "#F0ECE4", "e": "🛏", "cap": "Brudepar-suite"}, {"c": "#E4DDD4", "e": "🌅", "cap": "Utsikt over Oslo"}, {"c": "#D8D2CC", "e": "🛁", "cap": "Baderomsdetaljer"}]}]},
  {id:"v102",cat:"lokale",    name:"Frogner Park Manor",      city:"Oslo",     price:120000,priceLabel:"fra 100 000 kr",rating:4.8,reviews:87,  verified:true, featured:false, fast:false, style:["luksus","klassisk"],    cap:200, desc:"Historisk herregård omgitt av parklandskap midt i Oslo. Eksklusiv og tidløs.",               tags:["Innendørs","Park","Privat","Overnatting"],   gallery:["#E8E4DC","#D4CCC0","#C8BFB0"], status:"exploring"},
  {id:"v103",cat:"lokale",    name:"Munkeby Gård",            city:"Lillestrøm",price:65000,priceLabel:"fra 55 000 kr",rating:4.7,reviews:62,  verified:true, featured:false, fast:true,  style:["natur","bohemsk"],      cap:80,  desc:"Romantisk gård med rustikk sjarm, blomstereng og låve. For dere som ønsker noe annerledes.", tags:["Utendørs","Låve","Gård","Rustikk"],          gallery:["#E8F0E8","#D4E4D4","#C8DCC8"], status:"exploring"},
  {id:"v104",cat:"fotograf",  name:"Nordlys Studio",          city:"Oslo",     price:38000, priceLabel:"fra 28 000 kr", rating:4.9,reviews:203, verified:true, featured:true,  fast:true,  style:["dokumentarisk","lys"], cap:0,   desc:"Ingrid Bakke fanger de ekte øyeblikkene. Kjent for naturlig lys og tidløse bilder.",       tags:["Inkl.video","Prøvetime","Redigering"],       gallery:["#E8EAF4","#D4D8EC","#C8CEE8"], status:"exploring", portfolio:[{"id": "p1", "title": "Seremoni & øyeblikk", "tag": "Dokumentarisk", "imgs": [{"c": "#E8EAF4", "e": "💍", "cap": "Ringseremoni"}, {"c": "#D4D8EC", "e": "😭", "cap": "Tårer og glede"}, {"c": "#C8CEE8", "e": "👰", "cap": "Brudeparet alene"}, {"c": "#DCE0F4", "e": "👨‍👩‍👧‍👦", "cap": "Familieportrett"}]}, {"id": "p2", "title": "Golden hour portrett", "tag": "Portrett", "imgs": [{"c": "#F4EDE8", "e": "🌇", "cap": "Solnedgang"}, {"c": "#ECE0D4", "e": "💛", "cap": "Varmt lys"}, {"c": "#E4D4C8", "e": "🌿", "cap": "Naturlige omgivelser"}]}, {"id": "p3", "title": "Bryllupsdetaljer", "tag": "Detaljer", "imgs": [{"c": "#EEF0F8", "e": "💐", "cap": "Brudebukett"}, {"c": "#E4E8F4", "e": "🎂", "cap": "Bryllupskake"}, {"c": "#DDE2F0", "e": "✉️", "cap": "Invitasjon og pynt"}]}]},
  {id:"v105",cat:"fotograf",  name:"Eline Kraft Foto",        city:"Bergen",   price:32000, priceLabel:"fra 24 000 kr", rating:4.8,reviews:156, verified:true, featured:false, fast:false, style:["romantisk","editorial"],cap:0,   desc:"Drømmende og filmaktig stil. Reiser over hele landet for de rette bildene.",                tags:["Reiser","Film","Kunstnerisk"],               gallery:["#F4E8EE","#ECD4DC","#E8C8D4"], status:"exploring"},
  {id:"v106",cat:"catering",  name:"Smakshuset AS",           city:"Oslo",     price:72000, priceLabel:"850 kr/pers",   rating:4.8,reviews:91,  verified:true, featured:true,  fast:true,  style:["klassisk","moderne"],   cap:300, desc:"3-retters til storselskapets krav. Menyprøve inkludert. Norsk råvarefokus.",              tags:["3-retters","Vegetar","Alkoholfritt","Buffet"],gallery:["#F0F5E8","#E4ECD4","#D8E4C8"], status:"exploring", portfolio:[{"id": "p1", "title": "3-retters galla", "tag": "Klassisk", "imgs": [{"c": "#EAF0E0", "e": "🍽", "cap": "Anretning forrett"}, {"c": "#DDECD2", "e": "🥩", "cap": "Indrefilet med béarnaise"}, {"c": "#D4E8C8", "e": "🍮", "cap": "Dessert-presentasjon"}, {"c": "#E8F0DC", "e": "🥗", "cap": "Salat­buffer"}]}, {"id": "p2", "title": "Bryllupskake & dessert", "tag": "Dessert", "imgs": [{"c": "#F0E8DC", "e": "🎂", "cap": "3-etasjes kake"}, {"c": "#EDE0D4", "e": "🍓", "cap": "Bær og friske blomster"}, {"c": "#E8D8CC", "e": "🍰", "cap": "Kake­skjæring"}]}]},
  {id:"v107",cat:"blomster",  name:"Blomsterloftet",          city:"Oslo",     price:22000, priceLabel:"fra 15 000 kr", rating:4.7,reviews:78,  verified:true, featured:false, fast:false, style:["romantisk","bohemsk"],  cap:0,   desc:"Spesialister på pioner, eukalyptus og viltvoksende blomster. Bryllupsbukett inkludert.",  tags:["Pioner","Eukalyptus","Borddekking"],         gallery:["#F5E8EE","#ECD4DC","#E4C8D4"], status:"exploring"},
  {id:"v108",cat:"musikk",    name:"DJ Erik Strand",          city:"Oslo",     price:14000, priceLabel:"fra 12 000 kr", rating:4.8,reviews:145, verified:true, featured:false, fast:true,  style:["allround","pop"],       cap:0,   desc:"Erfaren bryllups-DJ med eget lydanlegg og lysrigg. Spiller fra kl 18 til 02.",            tags:["Lydanlegg","Lys","Eget utstyr"],             gallery:["#E8EDF5","#D4DCF0","#C8D4EC"], status:"exploring"},
  {id:"v109",cat:"hår",       name:"Salon Mille",             city:"Oslo",     price:8500,  priceLabel:"fra 6 500 kr",  rating:4.9,reviews:312, verified:true, featured:true,  fast:true,  style:["naturlig","elegant"],   cap:0,   desc:"Camille Wang er Norges mest bestilte brudestylist. Prøvetime inkludert.",                 tags:["Prøvetime","Mobile","Brudepike"],            gallery:["#F5E8F0","#ECD4E8","#E4C8E0"], status:"exploring", portfolio:[{"id": "p1", "title": "Brudestyling", "tag": "Hår & makeup", "imgs": [{"c": "#F4E8F0", "e": "👰", "cap": "Ferdig brude­look"}, {"c": "#ECD4E8", "e": "💄", "cap": "Naturlig makeup"}, {"c": "#E4C8E0", "e": "✨", "cap": "Detalj øye­sminke"}, {"c": "#F0DCE8", "e": "💇", "cap": "Flettet opppsatt"}]}, {"id": "p2", "title": "Prøvetime resultater", "tag": "Prøvetime", "imgs": [{"c": "#F8F0EC", "e": "🪞", "cap": "Klassisk chignon"}, {"c": "#F0E8E4", "e": "🌸", "cap": "Blomster i håret"}]}]},
  {id:"v110",cat:"kake",      name:"Konditori Haugen",        city:"Oslo",     price:6500,  priceLabel:"fra 4 500 kr",  rating:4.8,reviews:67,  verified:true, featured:false, fast:false, style:["klassisk","rustikk"],   cap:0,   desc:"Håndverkskaker med friske blomster og naturlige ingredienser. Levering inkludert.",      tags:["Levering","Smaksprøve","Glutenfri"],         gallery:["#F5EDE8","#ECE0D4","#E4D4C8"], status:"exploring", portfolio:[{"id": "p1", "title": "Bryllupskaker 2024", "tag": "Kake", "imgs": [{"c": "#F4EDE0", "e": "🎂", "cap": "Hvit nakenkake"}, {"c": "#EDE4D4", "e": "🌸", "cap": "Pion­dekorert"}, {"c": "#E8DCC8", "e": "🍋", "cap": "Sitron & elderflower"}, {"c": "#F0E8D8", "e": "🤍", "cap": "Fondant elegant"}]}, {"id": "p2", "title": "Dessertbord", "tag": "Dessert", "imgs": [{"c": "#F8F4EC", "e": "🍭", "cap": "Candy bar"}, {"c": "#F4EEE4", "e": "🧁", "cap": "Cupcakes"}, {"c": "#F0E8DC", "e": "🍮", "cap": "Macarons"}]}]},
];


const RELATION_TYPES = ["Familie","Venner","Kollegaer","VIP","Partner-side","Brud-side","Brudgom-side","Barn","Annet"];
const TASK_STATUS_LABELS = { not_started:"Ikke startet", in_progress:"Pågår", waiting:"Venter", done:"Fullført", cancelled:"Avbrutt" };
const VENDOR_STATUS_LABELS = { researching:"Undersøkes", contacted:"Kontaktet", quote_received:"Tilbud mottatt", shortlisted:"Shortlistet", booked:"Booket", rejected:"Avslått" };
const BUDGET_PAYMENT_LABELS = { not_paid:"Ikke betalt", deposit_paid:"Depositum betalt", partially_paid:"Delvis betalt", paid:"Betalt", refunded:"Refundert" };
const RSVP_LABELS = { not_invited:"Ikke invitert", invited:"Invitert", accepted:"Takket ja", declined:"Takket nei", pending:"Avventer" };

const INITIAL_TASKS = [
  {id:1, title:"Book Lysebu Hotell",              category:"Lokale",          status:"done",        priority:"critical", due_date:"2025-01-15", notes:"Booket — stor sal med hage. Depositum betalt."},
  {id:2, title:"Book fotograf — Nordlys Studio",  category:"Foto / video",    status:"done",        priority:"critical", due_date:"2025-02-01", notes:"Ingrid Bakke er booket. Møte 1. mai for å gå gjennom shotlist."},
  {id:3, title:"Sett totalbudsjett",              category:"Administrativt",  status:"done",        priority:"high",     due_date:"2025-01-10", notes:"Totalramme 280 000 kr. Buffer 15 000."},
  {id:4, title:"Lag og ferdigstill gjesteliste",  category:"Gjester",         status:"done",        priority:"high",     due_date:"2025-02-20", notes:"84 gjester bekreftet, 6 venter fremdeles."},
  {id:5, title:"Velg catering — Smakshuset AS",   category:"Mat & drikke",    status:"done",        priority:"high",     due_date:"2025-03-01", notes:"3-retters meny valgt. Menyprøve 15. mai."},
  {id:6, title:"Send save the date",              category:"Invitasjoner",    status:"done",        priority:"normal",   due_date:"2025-02-14", notes:"Sendt til alle 84 på e-post og kort til eldre gjester."},
  {id:7, title:"Book frisør og makeup",           category:"Hår & makeup",    status:"done",        priority:"normal",   due_date:"2025-03-15", notes:"Salon Mille booket. Prøvetime 3. juni."},
  {id:8, title:"Bestill blomster og dekor",       category:"Blomster / dekor",status:"in_progress", priority:"normal",   due_date:"2025-04-30", notes:"Blomsterloftet — har møte 20. april. Vil ha pioner og eukalyptus."},
  {id:9, title:"Avklar vielsesseremoni og prest", category:"Seremoni",        status:"done",        priority:"critical", due_date:"2025-02-28", notes:"Vigslet av sokneprest Marte Holm. Kirken er booket kl 13:00."},
  {id:10,title:"Book bryllupsreise til Toscana",  category:"Transport",       status:"in_progress", priority:"normal",   due_date:"2025-04-01", notes:"Ser på villa i Siena, 10 dager. Venter på tilbud fra to reisebyrå."},
  {id:11,title:"Send invitasjoner med RSVP",      category:"Invitasjoner",    status:"done",        priority:"high",     due_date:"2025-03-20", notes:"Papirkortet sendt. Frist for svar var 1. mai."},
  {id:12,title:"Bestill bryllupskake",            category:"Mat & drikke",    status:"done",        priority:"normal",   due_date:"2025-03-10", notes:"Konditori Haugen — 3-etasjers hvit kake med friske blomster."},
  {id:13,title:"Prøving av brudekjole",           category:"Hår & makeup",    status:"in_progress", priority:"high",     due_date:"2025-05-10", notes:"Har hatt én prøving. Trenger to til — en i mai, en i juni."},
  {id:14,title:"Bestill transport for gjester",   category:"Transport",       status:"not_started", priority:"normal",   due_date:"2025-05-01", notes:"Shuttlebuss fra Oslo S til Lysebu. Kontakt Nettbuss."},
  {id:15,title:"Lag bordplassering",              category:"Bordplassering",  status:"not_started", priority:"high",     due_date:"2025-05-20", notes:"Vente til alle RSVP er mottatt."},
  {id:16,title:"Skriv takketaler og program",     category:"Seremoni",        status:"not_started", priority:"normal",   due_date:"2025-05-15", notes:""},
  {id:17,title:"Lag detaljert tidsplan for dagen",category:"Administrativt",  status:"not_started", priority:"high",     due_date:"2025-05-25", notes:"Koordiner med fotograf, lokale og catering."},
  {id:18,title:"Sett opp bryllupsnettside",       category:"Invitasjoner",    status:"done",        priority:"normal",   due_date:"2025-03-01", notes:"Nettside er live med praktisk info og RSVP-skjema."},
];

const INITIAL_BUDGET = [
  {id:1, category:"Lokale",        name:"Lysebu Hotell — lokale og overnatting", estimated_cost:85000, actual_cost:85000, payment_status:"deposit_paid",  notes:"Depositum 25 000 kr betalt. Restbeløp forfaller 1. juli."},
  {id:2, category:"Mat & drikke",  name:"Smakshuset AS — catering 3-retters",   estimated_cost:72000, actual_cost:68000, payment_status:"deposit_paid",  notes:"Endelig pris avhenger av valg av vin. Ca 850 kr/pers."},
  {id:3, category:"Foto / video",  name:"Nordlys Studio — foto og video",        estimated_cost:38000, actual_cost:38000, payment_status:"deposit_paid",  notes:"Inkluderer 8 timers fotografering + redigert film."},
  {id:4, category:"Blomster & dekor",name:"Blomsterloftet — pioner og eukalyptus",estimated_cost:22000, actual_cost:0,    payment_status:"not_paid",      notes:"Tilbud mottatt. Endelig bestilling gjøres etter møte."},
  {id:5, category:"Klær & styling",name:"Brudekjole og tilbehør",               estimated_cost:28000, actual_cost:24500, payment_status:"paid",          notes:"Kjole fra Brudekolleksjonen. Sløyfe og slør inkludert."},
  {id:6, category:"Klær & styling",name:"Frisør og makeup — Salon Mille",        estimated_cost:8500,  actual_cost:8500,  payment_status:"paid",          notes:"Inkluderer prøvetime og bryllupsdag for brud + 2."},
  {id:7, category:"Musikk",        name:"DJ Erik Strand — kveld og fest",        estimated_cost:14000, actual_cost:14000, payment_status:"deposit_paid",  notes:"Spiller fra kl 18 til 01. Eget lydanlegg."},
  {id:8, category:"Transport",     name:"Shuttlebuss Oslo S — Lysebu t/r",       estimated_cost:9500,  actual_cost:0,    payment_status:"not_paid",      notes:"Kontaktet Nettbuss. Tilbud ventes."},
  {id:9, category:"Seremoni",      name:"Kirke og prest — vigselsgebyr",         estimated_cost:3500,  actual_cost:3500,  payment_status:"paid",          notes:"Betalt ved bestilling."},
  {id:10,category:"Mat & drikke",  name:"Konditori Haugen — bryllupskake",       estimated_cost:6500,  actual_cost:6500,  payment_status:"paid",          notes:"3-etasjers hvit kake, leveres Lysebu kl 14."},
  {id:11,category:"Diverse",       name:"Invitasjoner og trykksaker",            estimated_cost:4500,  actual_cost:4200,  payment_status:"paid",          notes:"Trykt hos Grafisk Studio, 90 stk."},
  {id:12,category:"Buffer",        name:"Buffer og uforutsette utgifter",        estimated_cost:15000, actual_cost:0,    payment_status:"not_paid",      notes:"Satt av 15 000 kr som buffer."},
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
function useCountdown(dateStr) {
  const calc = React.useCallback(() => {
    if (!dateStr) return { d:0,h:0,m:0,s:0 };
    const diff = Math.max(0, new Date(dateStr) - Date.now());
    return { d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000) };
  }, [dateStr]);
  const [v, setV] = useState(calc);
  useEffect(() => { const id = setInterval(() => setV(calc()), 1000); return () => clearInterval(id); }, [calc]);
  return v;
}

function initials(name) {
  if (!name) return "?";
  const p = name.trim().split(/\s+/);
  return p.length >= 2 ? p[0][0] + p[p.length-1][0] : p[0].slice(0,2);
}

function fmtKr(n) {
  return (n||0).toLocaleString("nb-NO") + " kr";
}

function parseDateToISO(dateStr) {
  if (!dateStr) return null;
  const months = {januar:0,februar:1,mars:2,april:3,mai:4,juni:5,juli:6,august:7,september:8,oktober:9,november:10,desember:11};
  const m = dateStr.match(/(\d{1,2})\.\s*(\w+)\s*(\d{4})/);
  if (!m) return null;
  const mo = months[m[2].toLowerCase()];
  return mo !== undefined ? `${m[3]}-${String(mo+1).padStart(2,"0")}-${String(m[1]).padStart(2,"0")}T12:00:00` : null;
}

/* ═══════════════════════════════════════════════════════════
   UI PRIMITIVES
═══════════════════════════════════════════════════════════ */
function Tag({ type="muted", children }) {
  return <span className={`tag tag-${type}`}>{children}</span>;
}

function Prog({ pct, color="var(--bronze)", h=4 }) {
  return (
    <div style={{ height:h, background:"var(--border)", borderRadius:h/2, overflow:"hidden", marginTop:8 }}>
      <div style={{ height:"100%", width:`${Math.min(100,Math.max(0,pct))}%`, background:color, borderRadius:h/2, transition:"width .6s ease" }}/>
    </div>
  );
}

function Toast({ msg, onDone }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 2400);
    const t2 = setTimeout(onDone, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  return (
    <div className="toast" style={{ opacity: out ? 0 : 1, transition: "opacity .3s" }}>
      <span style={{ color:"var(--bronze)", fontSize:14 }}>✓</span>
      <span>{msg}</span>
    </div>
  );
}

function Sheet({ title, onClose, children }) {
  return (
    <div className="sheet-overlay fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle"/>
        {title && <div className="sheet-title">{title}</div>}
        {children}
      </div>
    </div>
  );
}

function EmptyState({ title, sub, cta, onCta }) {
  return (
    <div className="empty">
      <div className="empty-icon">—</div>
      <div className="empty-title">{title}</div>
      <div className="empty-sub">{sub}</div>
      {cta && <button className="btn btn-primary btn-sm" onClick={onCta}>{cta}</button>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ONBOARDING
═══════════════════════════════════════════════════════════ */
const WEDDING_STYLES = [
  {
    id:"klassisk", label:"Klassisk & tidløst",
    sub:"Hvite blomster, elegante detaljer, tradisjonelle elementer. Tidløst og vakkert.",
    preview:"linear-gradient(135deg,#F5F0EA 0%,#EDE4D6 40%,#D4C4A8 100%)",
    accent:"#B8956A", accentL:"#F5EDE0",
    swatch1:"#F5F0EA", swatch2:"#EDE4D6", swatch3:"#B8956A",
    keywords:["Hvitt og krem","Roser og liljer","Klassisk seremoni","Formelt bord"],
  },
  {
    id:"moderne", label:"Moderne & minimalistisk",
    sub:"Rene linjer, få elementer, sterk typografi. Arkitektonisk og sofistikert.",
    preview:"linear-gradient(135deg,#E8E6E2 0%,#D4D0CA 40%,#A8A49E 100%)",
    accent:"#6A6A68", accentL:"#EBEBEA",
    swatch1:"#E8E6E2", swatch2:"#D4D0CA", swatch3:"#6A6A68",
    keywords:["Geometri og struktur","Monotone farger","Minimal blomster","Ren linjeføring"],
  },
  {
    id:"romantisk", label:"Romantisk & drømmende",
    sub:"Myke roser, lyse stearinlys, pastelfarger. Varm, feminin og eventyrlig.",
    preview:"linear-gradient(135deg,#F5E6E8 0%,#EDD0D4 40%,#C89098 100%)",
    accent:"#C08080", accentL:"#F9EDED",
    swatch1:"#F5E6E8", swatch2:"#EDD0D4", swatch3:"#C08080",
    keywords:["Pastell og blush","Pioner og roser","Stearinlys overalt","Drømmende tekstiler"],
  },
  {
    id:"natur", label:"Natur & bohemsk",
    sub:"Viltvoksende blomster, tre og stein, uteseremonier. Jordnært og autentisk.",
    preview:"linear-gradient(135deg,#E8EADE 0%,#D4D8C0 40%,#9AA880 100%)",
    accent:"#7A8A6A", accentL:"#EBF0E4",
    swatch1:"#E8EADE", swatch2:"#D4D8C0", swatch3:"#7A8A6A",
    keywords:["Vill natur","Pampas og eukalyptus","Tre og naturmaterialer","Friluft"],
  },
  {
    id:"luksus", label:"Luksus & eksklusivt",
    sub:"Gull, marmor, opulent blomsterdekor. Overdådighet i alle detaljer.",
    preview:"linear-gradient(135deg,#F0E8D0 0%,#D8C898 40%,#B09050 100%)",
    accent:"#B8956A", accentL:"#F5EDD8",
    swatch1:"#F0E8D0", swatch2:"#D8C898", swatch3:"#B09050",
    keywords:["Gull og messing","Monumentale arrangementer","Premium materialer","Svart tie"],
  },
  {
    id:"intimt", label:"Intimt & personlig",
    sub:"Under 30 gjester, nære relasjoner, lange middager. Autentisk og nært.",
    preview:"linear-gradient(135deg,#EDE8E4 0%,#DDD6CE 40%,#B0A898 100%)",
    accent:"#9A8A7A", accentL:"#F0EBE6",
    swatch1:"#EDE8E4", swatch2:"#DDD6CE", swatch3:"#9A8A7A",
    keywords:["Lite selskap","Lange bord","Hjemlig atmosfære","Personlige detaljer"],
  },
];

const PLANNING_MILESTONES = [
  {id:"date_set",       label:"Vi har satt datoen"},
  {id:"venue_booked",   label:"Lokale er booket"},
  {id:"budget_set",     label:"Budsjettet er satt"},
  {id:"guest_list",     label:"Gjesteliste er laget"},
  {id:"photographer",   label:"Fotograf er booket"},
  {id:"catering",       label:"Catering / mat er avklart"},
  {id:"invitations",    label:"Invitasjoner er sendt"},
  {id:"ceremony",       label:"Seremoni er planlagt"},
  {id:"attire",         label:"Klær og styling er valgt"},
  {id:"honeymoon",      label:"Bryllupsreise er planlagt"},
];

const GUEST_RANGES = [
  {id:"u20",   label:"Under 20",  sub:"Intimt og nært"},
  {id:"20-50", label:"20 – 50",   sub:"Lite og personlig"},
  {id:"50-100",label:"50 – 100",  sub:"Middels størrelse"},
  {id:"100-150",label:"100 – 150",sub:"Større fest"},
  {id:"150p",  label:"150+",      sub:"Stor feiring"},
];

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [w, setW] = useState({
    name1:"", name2:"", display_name:"",
    date:"", date_uncertain:false,
    country:"Norge", city:"", venue_type:"",
    guest_count:"50-100",
    budget_total:"", budget_uncertain:false,
    wedding_style:"klassisk",
    planning_milestones:[],  // array of completed milestone ids
    partner_email:"",
  });
  const set = k => e => setW(x => ({ ...x, [k]: e.target ? e.target.value : e }));

  const STEPS = [
    {
      kicker:"Velkommen",
      title:"Hvem gifter seg?",
      sub:"Skriv inn navnene til brudeparet — dette er starten på noe fantastisk.",
      valid: () => w.name1.trim() && w.name2.trim(),
      content: (
        <div>
          <div className="inp-wrap"><label className="label">Navn 1</label><input className="inp" value={w.name1} onChange={set("name1")} placeholder="f.eks. Emma" autoFocus/></div>
          <div className="inp-wrap"><label className="label">Navn 2</label><input className="inp" value={w.name2} onChange={set("name2")} placeholder="f.eks. Lars"/></div>
          <div className="inp-wrap"><label className="label">Visningsnavn for bryllupet (valgfritt)</label><input className="inp" value={w.display_name} onChange={set("display_name")} placeholder={w.name1&&w.name2?`${w.name1} & ${w.name2}`:""}/></div>
        </div>
      )
    },
    {
      kicker:"Dato",
      title:"Når er den store dagen?",
      sub:"Oppgi bryllupsdatoen om dere vet det, eller velg 'dato ikke satt ennå'.",
      valid: () => true,
      content: (
        <div>
          {!w.date_uncertain && <div className="inp-wrap"><label className="label">Bryllupsdato</label><input className="inp" type="date" value={w.date} onChange={set("date")}/></div>}
          <div className="opt-btn" onClick={() => setW(x=>({...x,date_uncertain:!x.date_uncertain,date:x.date_uncertain?x.date:""}))} style={{cursor:"pointer",border:`1.5px solid ${w.date_uncertain?"var(--bronze)":"var(--border)"}`,background:w.date_uncertain?"var(--bronzeL)":"var(--white)"}}>
            <div className={`opt-dot ${w.date_uncertain?"on":""}`}>{w.date_uncertain&&<span style={{color:"white",fontSize:10}}>✓</span>}</div>
            <div><div className="opt-label">Dato ikke satt ennå</div><div className="opt-sub">Appen fungerer likevel med en foreløpig plan</div></div>
          </div>
        </div>
      )
    },
    {
      kicker:"Sted",
      title:"Hvor gifter dere dere?",
      sub:"Land og by hjelper oss tilpasse forslag og leverandørsøk.",
      valid: () => true,
      content: (
        <div>
          <div className="inp-wrap"><label className="label">Land</label><input className="inp" value={w.country} onChange={set("country")} placeholder="f.eks. Norge"/></div>
          <div className="inp-wrap"><label className="label">By / region</label><input className="inp" value={w.city} onChange={set("city")} placeholder="f.eks. Oslo"/></div>
          <div className="inp-wrap"><label className="label">Type lokale (valgfritt)</label><input className="inp" value={w.venue_type} onChange={set("venue_type")} placeholder="f.eks. villa, hotell, gård, strand…"/></div>
        </div>
      )
    },
    {
      kicker:"Gjester",
      title:"Omtrent hvor mange gjester?",
      sub:"Dette hjelper oss beregne budsjett og oppgaver.",
      valid: () => !!w.guest_count,
      content: (
        <div>
          {GUEST_RANGES.map(r => (
            <div key={r.id} className="opt-btn" onClick={() => setW(x=>({...x,guest_count:r.id}))} style={{border:`1.5px solid ${w.guest_count===r.id?"var(--bronze)":"var(--border)"}`,background:w.guest_count===r.id?"var(--bronzeL)":"var(--white)"}}>
              <div className={`opt-dot ${w.guest_count===r.id?"on":""}`}>{w.guest_count===r.id&&<span style={{color:"white",fontSize:10}}>✓</span>}</div>
              <div><div className="opt-label">{r.label}</div><div className="opt-sub">{r.sub}</div></div>
            </div>
          ))}
        </div>
      )
    },
    {
      kicker:"Budsjett",
      title:"Hva er totalbudsjettet?",
      sub:"Beløpet brukes til å gi smarte anbefalinger og budsjettoppsett.",
      valid: () => true,
      content: (
        <div>
          {!w.budget_uncertain && <div className="inp-wrap"><label className="label">Totalbudsjett (kr)</label><input className="inp" type="number" value={w.budget_total} onChange={set("budget_total")} placeholder="f.eks. 200000"/></div>}
          <div className="opt-btn" onClick={() => setW(x=>({...x,budget_uncertain:!x.budget_uncertain,budget_total:x.budget_uncertain?x.budget_total:""}))} style={{border:`1.5px solid ${w.budget_uncertain?"var(--bronze)":"var(--border)"}`,background:w.budget_uncertain?"var(--bronzeL)":"var(--white)"}}>
            <div className={`opt-dot ${w.budget_uncertain?"on":""}`}>{w.budget_uncertain&&<span style={{color:"white",fontSize:10}}>✓</span>}</div>
            <div><div className="opt-label">Usikkert / setter det senere</div><div className="opt-sub">Vi setter opp et budsjettskjelett du kan fylle ut</div></div>
          </div>
        </div>
      )
    },
    {
      kicker:"Stil",
      title:"Hvilken stil passer dere?",
      sub:"Bla gjennom stilene — forhåndsvisningen endres fortløpende mens du velger.",
      valid: () => !!w.wedding_style,
      content: (() => {
        const sel = WEDDING_STYLES.find(s=>s.id===w.wedding_style) || WEDDING_STYLES[0];
        return (
          <div>
            {/* Live gradient preview */}
            <div style={{borderRadius:14,overflow:"hidden",marginBottom:18,transition:"all .4s ease",background:sel.preview}}>
              {/* Colour swatches strip */}
              <div style={{display:"flex",height:6}}>
                <div style={{flex:1,background:sel.swatch1}}/>
                <div style={{flex:1,background:sel.swatch2}}/>
                <div style={{flex:1,background:sel.swatch3}}/>
              </div>
              {/* Main preview area */}
              <div style={{padding:"22px 20px 20px",background:sel.preview}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:sel.accent,marginBottom:4,letterSpacing:"-.01em"}}>{sel.label}</div>
                <div style={{fontSize:13,color:sel.accent,opacity:.75,lineHeight:1.55,marginBottom:16}}>{sel.sub}</div>
                {/* Keyword pills */}
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {sel.keywords.map(k=>(
                    <div key={k} style={{background:"rgba(255,255,255,.65)",border:`1px solid ${sel.accent}30`,borderRadius:20,padding:"5px 12px",fontSize:11,color:sel.accent,fontWeight:600,letterSpacing:".03em"}}>{k}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dropdown */}
            <div style={{marginBottom:6}}>
              <label className="label">Velg stil</label>
              <select className="inp" value={w.wedding_style} onChange={e=>setW(x=>({...x,wedding_style:e.target.value}))} style={{fontSize:15,fontWeight:500}}>
                {WEDDING_STYLES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>
        );
      })()
    },
    {
      kicker:"Status",
      title:"Hva er allerede klart?",
      sub:"Huk av det dere allerede har ordnet. Appen tilpasser planen automatisk.",
      valid: () => true,
      content: (
        <div>
          <div style={{marginBottom:14,fontSize:13,color:"var(--muted)",lineHeight:1.6}}>
            Velg alt som gjelder — du kan endre dette når som helst.
          </div>
          {PLANNING_MILESTONES.map(m => {
            const checked = (w.planning_milestones||[]).includes(m.id);
            return (
              <div key={m.id}
                onClick={() => setW(x=>{
                  const cur = x.planning_milestones||[];
                  return {...x, planning_milestones: checked ? cur.filter(i=>i!==m.id) : [...cur,m.id]};
                })}
                style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",marginBottom:7,borderRadius:10,border:`1.5px solid ${checked?"var(--bronze)":"var(--border)"}`,background:checked?"var(--bronzeL)":"var(--white)",cursor:"pointer",transition:"all .15s"}}>
                <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${checked?"var(--bronze)":"var(--border)"}`,background:checked?"var(--bronze)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
                  {checked&&<span style={{color:"white",fontSize:12,fontWeight:700}}>✓</span>}
                </div>
                <div style={{fontSize:14,fontWeight:500,color:"var(--text)"}}>{m.label}</div>
              </div>
            );
          })}
          {(w.planning_milestones||[]).length === 0 && (
            <div style={{marginTop:10,fontSize:12,color:"var(--muted)",textAlign:"center",padding:"8px 0"}}>
              Ingen ting valgt — det er helt greit, vi starter fra scratch.
            </div>
          )}
        </div>
      )
    },
    {
      kicker:"Partner",
      title:"Inviter din partner",
      sub:"Send en invitasjon slik at dere kan planlegge sammen. Dette kan gjøres nå eller senere.",
      valid: () => true,
      content: (
        <div>
          <div className="inp-wrap"><label className="label">Partnerens e-post (valgfritt)</label><input className="inp" type="email" value={w.partner_email} onChange={set("partner_email")} placeholder="partner@epost.no"/></div>
          <div style={{background:"var(--stone)",borderRadius:10,padding:"14px 16px",fontSize:12,color:"var(--muted)",lineHeight:1.6}}>
            Partneren din vil få tilgang til å se og redigere bryllupet. Du styrer tilgangsnivå fra innstillinger.
          </div>
        </div>
      )
    },
    {
      kicker:"Klar",
      title:`${w.name1||"Dere"} & ${w.name2}`,
      sub:"Bryllupet er klart til å planlegges. Her er et sammendrag.",
      valid: () => true,
      content: (() => {
        const rows = [
          {l:"Bryllupspar", v:`${w.name1} & ${w.name2}`},
          {l:"Dato", v:w.date_uncertain?"Ikke satt ennå":(w.date?new Date(w.date).toLocaleDateString("nb-NO",{day:"numeric",month:"long",year:"numeric"}):"Ikke satt")},
          {l:"Sted", v:[w.city,w.country].filter(Boolean).join(", ")||"—"},
          {l:"Gjester", v:GUEST_RANGES.find(r=>r.id===w.guest_count)?.label||"—"},
          {l:"Budsjett", v:w.budget_uncertain?"Settes senere":(w.budget_total?fmtKr(Number(w.budget_total)):"Ikke oppgitt")},
          {l:"Stil", v:WEDDING_STYLES.find(s=>s.id===w.wedding_style)?.label||"—"},
          {l:"Allerede klart", v:`${(w.planning_milestones||[]).length} av ${PLANNING_MILESTONES.length} punkter`},
        ];
        return (
          <div>
            <div style={{background:"var(--text)",borderRadius:12,padding:22,marginBottom:16}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:500,color:"white",marginBottom:4}}>{w.name1} & {w.name2}</div>
              {!w.date_uncertain && w.date && <div style={{fontSize:12,color:"rgba(255,255,255,.45)",letterSpacing:".08em"}}>{new Date(w.date).toLocaleDateString("nb-NO",{day:"numeric",month:"long",year:"numeric"})}</div>}
            </div>
            <div style={{background:"var(--stone)",borderRadius:12,padding:"4px 16px"}}>
              {rows.map(r=>(
                <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:"1px solid var(--border)",fontSize:13}}>
                  <span style={{color:"var(--muted)"}}>{r.l}</span>
                  <span style={{fontWeight:500,color:"var(--text)"}}>{r.v||"—"}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()
    },
  ];

  const cur = STEPS[step];

  const finish = () => {
    const name = w.display_name || `${w.name1} & ${w.name2}`;
    onComplete({
      name1: w.name1.trim(), name2: w.name2.trim(),
      display_name: name,
      date: w.date_uncertain ? "" : w.date,
      date_uncertain: w.date_uncertain,
      country: w.country, city: w.city, venue_type: w.venue_type,
      guest_count: w.guest_count,
      budget_total: w.budget_uncertain ? 0 : (Number(w.budget_total)||0),
      budget_uncertain: w.budget_uncertain,
      wedding_style: w.wedding_style,
      planning_milestones: w.planning_milestones || [],
      partner_email: w.partner_email,
    });
  };

  return (
    <div className="onb-root">
      <CSS/>
      <div className="onb-header">
        <div className="onb-wordmark">Bryllupsappen</div>
        <div className="onb-progress">
          {STEPS.map((_,i) => (
            <div key={i} className="onb-prog-seg" style={{background: i<=step?"var(--bronze)":"rgba(255,255,255,.12)"}}/>
          ))}
        </div>
      </div>
      <div className="onb-body fade-up" key={step}>
        <div className="page-kicker">{cur.kicker} — {step+1} av {STEPS.length}</div>
        <div className="onb-step-title">{cur.title}</div>
        <div className="onb-step-sub">{cur.sub}</div>
        {cur.content}
      </div>
      <div className="onb-footer">
        {step > 0 && <button className="btn btn-outline" style={{flex:1}} onClick={() => setStep(s=>s-1)}>Tilbake</button>}
        <button
          className="btn btn-primary"
          style={{flex:2, opacity:cur.valid()?1:.5}}
          onClick={() => { if(!cur.valid()) return; step < STEPS.length-1 ? setStep(s=>s+1) : finish(); }}>
          {step < STEPS.length-1 ? "Neste" : "Start planleggingen"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════ */
function Dashboard({ wedding, tasks, guests, budget, vendors, setPage, showToast }) {
  const isoDate = parseDateToISO(wedding.date) || (wedding.date && !wedding.date_uncertain ? wedding.date+"T12:00:00" : null);
  const cd = useCountdown(isoDate);
  const doneTasks = tasks.filter(t=>t.status==="done").length;
  const totalEst = budget.reduce((s,b)=>s+(b.estimated_cost||0),0);
  const totalAct = budget.reduce((s,b)=>s+(b.actual_cost||0),0);
  const budgetUsed = wedding.budget_total > 0 ? totalEst : 0;
  const acceptedGuests = guests.filter(g=>g.rsvp_status==="accepted").length;
  const pendingGuests = guests.filter(g=>g.rsvp_status==="pending"||g.rsvp_status==="invited").length;
  const bookedVendors = vendors.filter(v=>v.status==="booked").length;
  const urgentTasks = tasks.filter(t=>t.status!=="done"&&t.status!=="cancelled"&&(t.priority==="critical"||t.priority==="high")).slice(0,4);

  return (
    <div className="page-wrap fade-up">
      <div className="page-header">
        <div className="page-kicker">Dashboard</div>
        <div className="h1">{wedding.display_name}</div>
        {wedding.city && <div className="p-muted mt4">{wedding.city}{wedding.country&&wedding.country!=="Norge"?`, ${wedding.country}`:""}</div>}
      </div>

      {/* Countdown hero */}
      {isoDate && (
        <div className="insight-card mb12">
          <div className="insight-top">
            <div>
              <div style={{fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.3)",marginBottom:4}}>
                {wedding.date ? new Date(wedding.date).toLocaleDateString("nb-NO",{day:"numeric",month:"long",year:"numeric"}) : "Dato settes snart"}
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:500,color:"white"}}>Nedtelling</div>
            </div>
            <div className="live-dot" style={{marginTop:6}}/>
          </div>
          <div className="countdown-grid">
            {[{n:cd.d,l:"Dager"},{n:cd.h,l:"Timer"},{n:cd.m,l:"Min"},{n:cd.s,l:"Sek"}].map(u=>(
              <div key={u.l} className="cd-cell">
                <div className="cd-n">{String(u.n).padStart(2,"0")}</div>
                <div className="cd-l">{u.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="stat-grid">
        <div className="stat-card accent" style={{cursor:"pointer"}} onClick={()=>setPage("tasks")}>
          <div className="stat-n">{doneTasks}<span style={{fontSize:16,fontWeight:400,color:"var(--muted)"}}> / {tasks.length}</span></div>
          <div className="stat-l">Oppgaver fullført</div>
          <Prog pct={(doneTasks/Math.max(tasks.length,1))*100}/>
        </div>
        <div className="stat-card" style={{cursor:"pointer"}} onClick={()=>setPage("guests")}>
          <div className="stat-n">{acceptedGuests}</div>
          <div className="stat-l">Bekreftet</div>
          <div className="stat-sub">{pendingGuests} avventer</div>
        </div>
        <div className="stat-card" style={{cursor:"pointer"}} onClick={()=>setPage("budget")}>
          <div className="stat-n">{Math.round(totalEst/1000)}<span style={{fontSize:14,color:"var(--muted)",fontWeight:400}}>k kr</span></div>
          <div className="stat-l">Estimert budsjett</div>
          {wedding.budget_total>0 && <Prog pct={(totalEst/wedding.budget_total)*100}/>}
        </div>
        <div className="stat-card" style={{cursor:"pointer"}} onClick={()=>setPage("vendors")}>
          <div className="stat-n">{bookedVendors}</div>
          <div className="stat-l">Leverandører booket</div>
          <div className="stat-sub">{vendors.length} totalt</div>
        </div>
      </div>

      {/* Smart next steps */}
      {(() => {
        const milestones = wedding.planning_milestones || [];
        const hasMilestone = id => milestones.includes(id);
        const daysLeft = isoDate ? Math.floor((new Date(isoDate)-Date.now())/86400000) : null;
        const openCritical = tasks.filter(t=>t.status!=="done"&&t.priority==="critical");

        // Build smart recommendations based on context
        const recs = [];

        // Phase 1: Fundamentals
        if (!hasMilestone("date_set") && !wedding.date) {
          recs.push({label:"Sett en bryllupsdato", why:"Datoen låser alt annet — leverandører, lokale og gjester trenger dette.", page:"settings", urgent:true});
        }
        if (!hasMilestone("budget_set") && !wedding.budget_total) {
          recs.push({label:"Sett et totalbudsjett", why:"Et budsjett er kompasset for alle beslutninger fremover.", page:"budget", urgent:true});
        }
        if (!hasMilestone("venue_booked") && vendors.filter(v=>v.category==="Lokale"&&v.status==="booked").length===0) {
          recs.push({label:"Book bryllupslokale", why:"Lokalet er den største enkeltbeslutningen og bør bookes 12–18 måneder i forveien.", page:"vendors", urgent:true});
        }

        // Phase 2: Early planning
        if (!hasMilestone("photographer") && vendors.filter(v=>v.category==="Fotograf"&&v.status==="booked").length===0) {
          recs.push({label:"Book fotograf", why:"Gode fotografer er fullbooket 8–12 måneder i forveien.", page:"vendors", urgent:daysLeft&&daysLeft<365});
        }
        if (!hasMilestone("guest_list") && guests.length < 5) {
          recs.push({label:"Lag gjestelisten", why:"Gjestelisten påvirker lokalevalg, budsjett og bordplassering.", page:"guests", urgent:false});
        }
        if (!hasMilestone("catering") && vendors.filter(v=>v.category==="Catering"&&v.status==="booked").length===0 && (hasMilestone("venue_booked")||guests.length>5)) {
          recs.push({label:"Avklar catering", why:"Mat og drikke er gjerne 30–40% av budsjettet — start tidlig.", page:"vendors", urgent:false});
        }

        // Phase 3: Mid-planning
        if (!hasMilestone("invitations") && guests.length>0 && guests.filter(g=>g.rsvp_status==="not_invited").length>0) {
          recs.push({label:"Send invitasjoner", why:`${guests.filter(g=>g.rsvp_status==="not_invited").length} gjester venter på invitasjon.`, page:"guests", urgent:daysLeft&&daysLeft<270});
        }
        if (!hasMilestone("ceremony") && vendors.filter(v=>v.category==="Seremoni"||v.category==="Planlegger").length===0 && hasMilestone("venue_booked")) {
          recs.push({label:"Planlegg seremonien", why:"Vielsessted, tidspunkt og form bør avklares tidlig.", page:"tasks", urgent:false});
        }

        // Always: open critical tasks
        openCritical.slice(0,2).forEach(t => {
          if (!recs.find(r=>r.label===t.title)) {
            recs.push({label:t.title, why:t.category+(t.due_date?` · Frist ${t.due_date}`:""), page:"tasks", urgent:t.priority==="critical"});
          }
        });

        // RSVP follow-up
        const pendingRsvp = guests.filter(g=>g.rsvp_status==="pending"||g.rsvp_status==="invited").length;
        if (pendingRsvp > 0 && hasMilestone("invitations")) {
          recs.push({label:`Følg opp ${pendingRsvp} ubesvarte invitasjoner`, why:"Send en vennlig påminnelse til de som ikke har svart.", page:"guests", urgent:false});
        }

        // Seating when most guests confirmed
        const confirmed = guests.filter(g=>g.rsvp_status==="accepted").length;
        if (confirmed >= 10 && !hasMilestone("seating")) {
          recs.push({label:"Start bordplanleggingen", why:`${confirmed} gjester har bekreftet — nok til å begynne plassering.`, page:"seating", urgent:false});
        }

        const show = recs.slice(0,5);
        if (show.length === 0) return null;

        return (
          <div className="card" style={{borderLeft:"3px solid var(--bronze)"}}>
            <div className="section-head">
              <div className="h3">Anbefalte neste steg</div>
              <span className="link-text" onClick={()=>setPage("tasks")}>Alle oppgaver</span>
            </div>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:14,lineHeight:1.6}}>
              Tilpasset basert på hva dere har gjort og hva som vanligvis bør skje i denne fasen.
            </div>
            {show.map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 0",borderBottom:i<show.length-1?"1px solid var(--border)":"none",cursor:"pointer"}} onClick={()=>setPage(r.page)}>
                <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${r.urgent?"var(--amber)":"var(--border)"}`,flexShrink:0,marginTop:1,background:r.urgent?"var(--amberL)":"transparent"}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:500,color:"var(--text)",marginBottom:2}}>{r.label}</div>
                  <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.5}}>{r.why}</div>
                </div>
                <span style={{fontSize:14,color:"var(--faint)",flexShrink:0,marginTop:1}}>›</span>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Quick actions */}
      <div className="card">
        <div className="h3 mb12">Hurtighandlinger</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[
            {l:"Legg til gjest",    p:"guests"},
            {l:"Legg til leverandør", p:"vendors"},
            {l:"Ny oppgave",        p:"tasks"},
            {l:"Åpne budsjett",     p:"budget"},
          ].map(a=>(
            <button key={a.l} className="btn btn-outline btn-sm btn-full" onClick={()=>setPage(a.p)}>{a.l}</button>
          ))}
        </div>
      </div>

      {/* Budget insight */}
      {totalEst > 0 && (
        <div className="card">
          <div className="section-head">
            <div className="h3">Budsjettstatus</div>
            <span className="link-text" onClick={()=>setPage("budget")}>Detaljer</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
            <span style={{fontSize:22,fontFamily:"'Playfair Display',serif",fontWeight:500}}>{fmtKr(totalEst)}</span>
            {wedding.budget_total>0 && <span style={{fontSize:12,color:"var(--muted)"}}>av {fmtKr(wedding.budget_total)}</span>}
          </div>
          {wedding.budget_total>0 && <Prog pct={(totalEst/wedding.budget_total)*100} color={totalEst>wedding.budget_total?"var(--red)":"var(--bronze)"}/>}
          {totalAct > 0 && <div style={{marginTop:8,fontSize:12,color:"var(--muted)"}}>Faktisk brukt: {fmtKr(totalAct)}</div>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TASKS / PLAN
═══════════════════════════════════════════════════════════ */
function Tasks({ tasks, setTasks, showToast }) {
  const [filter, setFilter] = useState("Alle");
  const [sheet, setSheet] = useState(false);
  const [draft, setDraft] = useState(null);

  const cats = ["Alle", ...TASK_CATS];
  const list = filter === "Alle" ? tasks : tasks.filter(t=>t.category===filter);
  const done = tasks.filter(t=>t.status==="done").length;

  const openNew = () => {
    setDraft({id:Date.now(),title:"",category:"Administrativt",status:"not_started",priority:"normal",due_date:"",assigned:"",notes:""});
    setSheet(true);
  };
  const openEdit = t => { setDraft({...t}); setSheet(true); };
  const toggleDone = id => setTasks(prev=>prev.map(t=>t.id===id?{...t,status:t.status==="done"?"not_started":"done"}:t));

  const save = () => {
    if (!draft.title.trim()) return;
    if (tasks.find(t=>t.id===draft.id)) {
      setTasks(prev=>prev.map(t=>t.id===draft.id?draft:t));
      showToast("Oppgave oppdatert");
    } else {
      setTasks(prev=>[...prev,draft]);
      showToast("Oppgave opprettet");
    }
    setSheet(false);
  };
  const del = () => {
    setTasks(prev=>prev.filter(t=>t.id!==draft.id));
    setSheet(false);
    showToast("Oppgave slettet");
  };

  const priorityColor = p => ({critical:"var(--red)",high:"var(--amber)",normal:"var(--muted)",low:"var(--faint)"}[p]||"var(--muted)");

  return (
    <div className="fade-up">
      <div className="plan-hero">
        <div className="ph-date">Plan & oppgaver</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <div className="ph-name">{done} av {tasks.length} fullført</div>
          </div>
          <button className="btn btn-outline btn-sm" style={{color:"white",borderColor:"rgba(255,255,255,.2)",background:"rgba(255,255,255,.08)"}} onClick={openNew}>+ Oppgave</button>
        </div>
        <Prog pct={(done/Math.max(tasks.length,1))*100} color="var(--bronze)" h={3}/>
      </div>

      <div className="page-wrap">
        <div className="chips">
          {cats.map(c=><button key={c} className={`chip ${filter===c?"on":""}`} onClick={()=>setFilter(c)}>{c}</button>)}
        </div>

        {list.length === 0
          ? <EmptyState title="Ingen oppgaver" sub="Legg til din første oppgave for å komme i gang." cta="Legg til oppgave" onCta={openNew}/>
          : (
            <div className="card-flush">
              <div style={{padding:"0 20px"}}>
                {list.map(t=>(
                  <div key={t.id} className="task-row">
                    <div className={`task-check ${t.status==="done"?"done":""} ${t.priority==="critical"&&t.status!=="done"?"urgent":""}`} onClick={()=>toggleDone(t.id)}>
                      {t.status==="done" && <span style={{color:"white",fontSize:11}}>✓</span>}
                    </div>
                    <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>openEdit(t)}>
                      <div style={{fontSize:14,fontWeight:500,textDecoration:t.status==="done"?"line-through":"none",opacity:t.status==="done"?.5:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</div>
                      <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{t.category}{t.due_date?` · ${t.due_date}`:""}</div>
                    </div>
                    <div style={{display:"flex",gap:5,flexShrink:0,alignItems:"center"}}>
                      {t.priority!=="normal" && t.status!=="done" && <div style={{width:6,height:6,borderRadius:"50%",background:priorityColor(t.priority)}}/>}
                      <span style={{fontSize:16,color:"var(--faint)"}}>›</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </div>

      {sheet && draft && (
        <Sheet title={tasks.find(t=>t.id===draft.id)?"Rediger oppgave":"Ny oppgave"} onClose={()=>setSheet(false)}>
          <div className="inp-wrap"><label className="label">Oppgavetittel</label><input className="inp" value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))} placeholder="Hva skal gjøres?" autoFocus/></div>
          <div className="inp-wrap"><label className="label">Kategori</label>
            <select className="inp" value={draft.category} onChange={e=>setDraft(d=>({...d,category:e.target.value}))}>
              {TASK_CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div><label className="label">Status</label>
              <select className="inp" value={draft.status} onChange={e=>setDraft(d=>({...d,status:e.target.value}))}>
                {Object.entries(TASK_STATUS_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label className="label">Prioritet</label>
              <select className="inp" value={draft.priority} onChange={e=>setDraft(d=>({...d,priority:e.target.value}))}>
                {[["critical","Kritisk"],["high","Høy"],["normal","Normal"],["low","Lav"]].map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="inp-wrap"><label className="label">Frist</label><input className="inp" type="date" value={draft.due_date} onChange={e=>setDraft(d=>({...d,due_date:e.target.value}))}/></div>
          <div className="inp-wrap"><label className="label">Notater</label><textarea className="inp" value={draft.notes} onChange={e=>setDraft(d=>({...d,notes:e.target.value}))} placeholder="Tilleggsinfo..."/></div>
          <button className="btn btn-primary btn-full mb8" onClick={save}>Lagre</button>
          {tasks.find(t=>t.id===draft.id) && <button className="btn btn-outline btn-full" style={{color:"var(--red)",borderColor:"var(--red)"}} onClick={del}>Slett oppgave</button>}
        </Sheet>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GUESTS
═══════════════════════════════════════════════════════════ */
function Guests({ guests, setGuests, showToast, wedding }) {
  const [filter,     setFilter]     = useState("Alle");
  const [sideFilter, setSideFilter] = useState("alle");
  const [search,     setSearch]     = useState("");
  const [editSheet,  setEditSheet]  = useState(false);
  const [commSheet,  setCommSheet]  = useState(false);
  const [draft,      setDraft]      = useState(null);
  const [selMode,    setSelMode]    = useState(false);
  const [selected,   setSelected]   = useState([]);
  const [commGuests, setCommGuests] = useState([]);
  const [commChan,   setCommChan]   = useState("email");
  const [commTpl,    setCommTpl]    = useState("invitation");
  const [commMsg,    setCommMsg]    = useState("");
  const [commSubj,   setCommSubj]   = useState("");

  const n1 = wedding?.name1 || "Brud";
  const n2 = wedding?.name2 || "Brudgom";
  const wDate  = wedding?.date ? new Date(wedding.date).toLocaleDateString("nb-NO",{day:"numeric",month:"long",year:"numeric"}) : "dato ikke satt";
  const wVenue = wedding?.venue || wedding?.city || "lokalet";
  const portal = `${n1.toLowerCase()}og${n2.toLowerCase()}.bryllup.no`;

  const TEMPLATES = {
    invitation: {
      label:"Invitasjon",
      subj:`Invitasjon til bryllupet til ${n1} & ${n2}`,
      email:`Kjære [Navn],\n\nVi har gleden av å invitere deg til vårt bryllup!\n\n${n1} & ${n2} gifter seg ${wDate} på ${wVenue}.\n\nBekreft din deltakelse her:\n${portal}\n\nMed hjertelig hilsen,\n${n1} & ${n2}`,
      sms:`Hei [Navn]! ${n1} & ${n2} gifter seg ${wDate} på ${wVenue} og inviterer deg! Svar her: ${portal}`,
    },
    reminder: {
      label:"Påminnelse",
      subj:`Påminnelse — svar på invitasjonen fra ${n1} & ${n2}`,
      email:`Kjære [Navn],\n\nVi venter fortsatt på ditt svar angående bryllupet vårt ${wDate} på ${wVenue}.\n\nVennligst bekreft eller avslå her:\n${portal}\n\nMed vennlig hilsen,\n${n1} & ${n2}`,
      sms:`Hei [Navn]! Påminnelse om å svare på bryllupsinnbydelsen vår. ${n1} & ${n2}, ${wDate}. Svar: ${portal}`,
    },
    practical: {
      label:"Praktisk info",
      subj:`Praktisk informasjon — bryllupet til ${n1} & ${n2}`,
      email:`Kjære [Navn],\n\nHer er praktisk info:\n\n${wDate}\n${wVenue}, kl. 14:00 (møt opp 30 min før)\nKleskode: ${wedding?.dress||"ikke oppgitt"}\n\nMer info: ${portal}\n\n${n1} & ${n2}`,
      sms:`Hei [Navn]! Praktisk info: ${n1} & ${n2}, ${wDate} kl 14:00 på ${wVenue}. Kleskode: ${wedding?.dress||"ikke oppgitt"}. Info: ${portal}`,
    },
    thankyou: {
      label:"Takk",
      subj:`Tusen takk fra ${n1} & ${n2}!`,
      email:`Kjære [Navn],\n\nTusen hjertelig takk for at du delte den spesielle dagen vår med oss!\n\nDet betydde enormt mye å ha deg der.\n\nMed varmeste klem,\n${n1} & ${n2}`,
      sms:`Hei [Navn]! Tusen takk for at du feiret med oss! Det betydde så mye. Klem fra ${n1} & ${n2}`,
    },
  };

  const accepted  = guests.filter(g=>g.rsvp_status==="accepted").length;
  const declined  = guests.filter(g=>g.rsvp_status==="declined").length;
  const pending   = guests.filter(g=>g.rsvp_status==="pending"||g.rsvp_status==="invited").length;
  const allergies = guests.filter(g=>g.allergies).length;
  const brudSide    = guests.filter(g=>g.side_of_couple==="brud").length;
  const brudgomSide = guests.filter(g=>g.side_of_couple==="brudgom").length;
  const fellesSide  = guests.filter(g=>!g.side_of_couple||g.side_of_couple==="felles").length;

  const filtered = guests.filter(g => {
    if (search && !`${g.first_name} ${g.last_name}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (sideFilter==="brud"    && g.side_of_couple!=="brud")    return false;
    if (sideFilter==="brudgom" && g.side_of_couple!=="brudgom") return false;
    if (sideFilter==="felles"  && g.side_of_couple!=="felles" && g.side_of_couple) return false;
    if (filter==="Bekreftet") return g.rsvp_status==="accepted";
    if (filter==="Avventer")  return g.rsvp_status==="pending"||g.rsvp_status==="invited";
    if (filter==="Avslått")   return g.rsvp_status==="declined";
    if (filter==="Allergier") return !!g.allergies;
    return true;
  });

  const applyTpl = (tplKey, chan) => {
    const t = TEMPLATES[tplKey]; if (!t) return;
    setCommSubj(t.subj||"");
    setCommMsg(chan==="sms" ? t.sms : t.email);
  };

  const openComm = (gList) => {
    setCommGuests(gList);
    applyTpl(commTpl, commChan);
    setCommSheet(true);
  };

  const sendSingle = (g) => {
    const msg  = encodeURIComponent(commMsg.replace(/\[Navn\]/g, g.first_name));
    const subj = encodeURIComponent(commSubj);
    if (commChan==="email" && g.email)  window.open(`mailto:${g.email}?subject=${subj}&body=${msg}`);
    else if (commChan==="sms" && g.phone) window.open(`sms:${g.phone}?body=${msg}`);
    else showToast(`${g.first_name} mangler ${commChan==="email"?"e-post":"telefonnummer"}`);
  };

  const sendAll = () => {
    const valid = commGuests.filter(g => commChan==="email" ? !!g.email : !!g.phone);
    if (!valid.length) { showToast("Ingen mottakere med " + (commChan==="email"?"e-post":"telefon")); return; }
    if (commChan==="email") {
      const to = valid.map(g=>g.email).join(",");
      window.open(`mailto:${to}?subject=${encodeURIComponent(commSubj)}&body=${encodeURIComponent(commMsg.replace(/\[Navn\]/g,"[Navn]"))}`);
    } else {
      valid.forEach((g,i) => setTimeout(()=> window.open(`sms:${g.phone}?body=${encodeURIComponent(commMsg.replace(/\[Navn\]/g,g.first_name))}`), i*300));
    }
    showToast(`Åpner ${commChan==="email"?"e-postklient":"SMS"} for ${valid.length} mottakere`);
    setCommSheet(false); setSelMode(false); setSelected([]);
  };

  const toggleSel = (id) => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);
  const openNew  = () => { setDraft({id:"g_"+Date.now(),first_name:"",last_name:"",email:"",phone:"",relation_category:"Venner",side_of_couple:"felles",rsvp_status:"not_invited",allergies:"",special_needs:"",plus_one_allowed:false,plus_one_name:"",notes:""}); setEditSheet(true); };
  const openEdit = (g) => { if (selMode){toggleSel(g.id);return;} setDraft({...g,side_of_couple:g.side_of_couple||"felles"}); setEditSheet(true); };
  const save = () => {
    if (!draft.first_name.trim()) return;
    if (guests.find(g=>g.id===draft.id)){ setGuests(p=>p.map(g=>g.id===draft.id?draft:g)); showToast("Gjest oppdatert"); }
    else { setGuests(p=>[...p,draft]); showToast(`${draft.first_name} lagt til`); }
    setEditSheet(false);
  };
  const del = () => { setGuests(p=>p.filter(g=>g.id!==draft.id)); setEditSheet(false); showToast("Gjest fjernet"); };

  const rsvpTag = s => {
    const m={accepted:["green","Ja"],declined:["red","Nei"],pending:["amber","Avventer"],invited:["blue","Invitert"],not_invited:["muted","Ikke inv."]};
    const [t,l]=m[s]||["muted",s]; return <Tag type={t}>{l}</Tag>;
  };
  const sideBadge = s => {
    if (s==="brud")    return <span style={{fontSize:9,fontWeight:600,color:"var(--bronze)",background:"var(--bronzeL)",borderRadius:10,padding:"2px 7px"}}>{n1}</span>;
    if (s==="brudgom") return <span style={{fontSize:9,fontWeight:600,color:"var(--sage)",background:"var(--sageL)",borderRadius:10,padding:"2px 7px"}}>{n2}</span>;
    return null;
  };
  const avatarStyle = g => ({
    background:g.side_of_couple==="brud"?"var(--bronzeL)":g.side_of_couple==="brudgom"?"var(--sageL)":"var(--stone)",
    color:g.side_of_couple==="brud"?"var(--bronze2)":g.side_of_couple==="brudgom"?"var(--sage)":"var(--muted)",
    border:`1px solid ${g.side_of_couple==="brud"?"rgba(184,137,106,.3)":g.side_of_couple==="brudgom"?"rgba(106,138,114,.3)":"var(--border)"}`,
  });

  return (
    <div className="fade-up">
      <div className="page-wrap">

        {/* Header */}
        <div className="page-header">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div><div className="page-kicker">Gjesteliste</div><div className="h1">{guests.length} gjester</div></div>
            <div style={{display:"flex",gap:8}}>
              {selMode ? (
                <>
                  <button className="btn btn-outline btn-sm" onClick={()=>{setSelMode(false);setSelected([]);}}>Avbryt</button>
                  {selected.length>0&&<button className="btn btn-bronze btn-sm" onClick={()=>openComm(guests.filter(g=>selected.includes(g.id)))}>Send til {selected.length}</button>}
                </>
              ) : (
                <>
                  <button className="btn btn-outline btn-sm" onClick={()=>setSelMode(true)}>Velg flere</button>
                  <button className="btn btn-bronze btn-sm" onClick={openNew}>+ Gjest</button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid" style={{marginBottom:12}}>
          <div className="stat-card"><div className="stat-n" style={{color:"var(--green)"}}>{accepted}</div><div className="stat-l">Bekreftet</div></div>
          <div className="stat-card"><div className="stat-n" style={{color:"var(--amber)"}}>{pending}</div><div className="stat-l">Avventer</div></div>
          <div className="stat-card"><div className="stat-n" style={{color:"var(--red)"}}>{declined}</div><div className="stat-l">Avslått</div></div>
          <div className="stat-card"><div className="stat-n">{allergies}</div><div className="stat-l">Allergier</div></div>
        </div>

        {/* Side split */}
        <div className="card" style={{padding:"14px 16px",marginBottom:12}}>
          <div style={{fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,marginBottom:10}}>Fordeling per side</div>
          <div style={{display:"flex",height:8,borderRadius:4,overflow:"hidden",marginBottom:10}}>
            <div style={{flex:brudSide,background:"var(--bronze)"}}/>
            <div style={{flex:fellesSide,background:"var(--border)"}}/>
            <div style={{flex:brudgomSide,background:"var(--sage)"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
            {[{key:"brud",label:n1,n:brudSide,color:"var(--bronze)",bg:"var(--bronzeL)"},{key:"felles",label:"Felles",n:fellesSide,color:"var(--muted)",bg:"var(--stone)"},{key:"brudgom",label:n2,n:brudgomSide,color:"var(--sage)",bg:"var(--sageL)"}].map(s=>(
              <button key={s.key} onClick={()=>setSideFilter(sf=>sf===s.key?"alle":s.key)}
                style={{padding:"8px 10px",borderRadius:8,border:`1.5px solid ${sideFilter===s.key?s.color:"var(--border)"}`,background:sideFilter===s.key?s.bg:"var(--white)",cursor:"pointer",textAlign:"center",transition:"all .15s"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:500,color:s.color}}>{s.n}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{s.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick send shortcuts */}
        {!selMode && (
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            {guests.filter(g=>g.rsvp_status==="not_invited").length>0&&(
              <button onClick={()=>{setCommTpl("invitation");applyTpl("invitation",commChan);openComm(guests.filter(g=>g.rsvp_status==="not_invited"));}}
                style={{flex:1,padding:"10px 8px",borderRadius:10,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:11,fontWeight:600,color:"var(--bronze2)",fontFamily:"'Inter',sans-serif",lineHeight:1.4}}>
                Send invitasjon til {guests.filter(g=>g.rsvp_status==="not_invited").length} ikke-inviterte
              </button>
            )}
            {pending>0&&(
              <button onClick={()=>{setCommTpl("reminder");applyTpl("reminder",commChan);openComm(guests.filter(g=>g.rsvp_status==="pending"||g.rsvp_status==="invited"));}}
                style={{flex:1,padding:"10px 8px",borderRadius:10,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:11,fontWeight:600,color:"var(--muted)",fontFamily:"'Inter',sans-serif",lineHeight:1.4}}>
                Purre {pending} som avventer
              </button>
            )}
          </div>
        )}

        {/* Search + filter */}
        <input className="inp" placeholder="Søk etter gjest..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:10}}/>
        <div className="chips">{["Alle","Bekreftet","Avventer","Avslått","Allergier"].map(f=><button key={f} className={`chip ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>{f}</button>)}</div>
        {selMode&&<div style={{fontSize:12,color:"var(--muted)",marginBottom:8,textAlign:"center"}}>{selected.length===0?"Trykk for å velge":`${selected.length} valgt`} · <span style={{color:"var(--bronze)",cursor:"pointer"}} onClick={()=>setSelected(s=>s.length===filtered.length?[]:filtered.map(g=>g.id))}>{selected.length===filtered.length?"Fjern alle":"Velg alle"}</span></div>}

        {/* List */}
        {filtered.length===0
          ? <EmptyState title="Ingen gjester" sub="Ingen passer til filtrene." cta="Legg til gjest" onCta={openNew}/>
          : (
            <div className="card-flush">
              <div style={{padding:"0 16px"}}>
                {filtered.map(g=>{
                  const isSel = selected.includes(g.id);
                  return (
                    <div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",borderBottom:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>openEdit(g)}>
                      {selMode&&(
                        <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${isSel?"var(--bronze)":"var(--border)"}`,background:isSel?"var(--bronze)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
                          {isSel&&<span style={{color:"white",fontSize:12,fontWeight:700}}>✓</span>}
                        </div>
                      )}
                      <div className="avatar" style={avatarStyle(g)}>{initials(`${g.first_name} ${g.last_name}`)}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.first_name} {g.last_name}{g.plus_one_name&&<span style={{fontSize:11,color:"var(--muted)",fontWeight:400}}> & {g.plus_one_name}</span>}</div>
                        <div style={{fontSize:11,color:"var(--muted)",marginTop:2,display:"flex",gap:6}}>
                          <span>{g.relation_category}</span>{g.allergies&&<span style={{color:"var(--amber)"}}>Allergi</span>}
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                        {rsvpTag(g.rsvp_status)}{sideBadge(g.side_of_couple)}
                      </div>
                      {!selMode&&(
                        <div style={{display:"flex",gap:4,flexShrink:0}}>
                          {g.email&&<button title="E-post" onClick={e=>{e.stopPropagation();setCommTpl("invitation");applyTpl("invitation","email");setCommChan("email");openComm([g]);}} style={{width:30,height:30,borderRadius:8,border:"1.5px solid var(--border)",background:"var(--stone)",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)"}}>✉</button>}
                          {g.phone&&<button title="SMS" onClick={e=>{e.stopPropagation();setCommTpl("invitation");applyTpl("invitation","sms");setCommChan("sms");openComm([g]);}} style={{width:30,height:30,borderRadius:8,border:"1.5px solid var(--border)",background:"var(--stone)",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)",fontWeight:700}}>SMS</button>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        }
      </div>

      {/* ── COMMUNICATION SHEET ── */}
      {commSheet&&(
        <Sheet title={commGuests.length===1?`Kontakt ${commGuests[0].first_name}`:`Send til ${commGuests.length} gjester`} onClose={()=>setCommSheet(false)}>
          <div style={{display:"flex",background:"var(--stone)",borderRadius:9,padding:3,marginBottom:14}}>
            {[{k:"email",l:"E-post ✉"},{k:"sms",l:"SMS"}].map(c=>(
              <button key={c.k} onClick={()=>{setCommChan(c.k);applyTpl(commTpl,c.k);}}
                style={{flex:1,padding:"9px",borderRadius:7,border:"none",background:commChan===c.k?"var(--white)":"transparent",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",color:commChan===c.k?"var(--text)":"var(--muted)",transition:"all .15s"}}>
                {c.l}
              </button>
            ))}
          </div>
          <div className="label">Velg mal</div>
          <div className="chips" style={{marginBottom:14}}>
            {Object.entries(TEMPLATES).map(([k,t])=>(
              <button key={k} className={`chip ${commTpl===k?"on":""}`} onClick={()=>{setCommTpl(k);applyTpl(k,commChan);}}>{t.label}</button>
            ))}
          </div>
          {commChan==="email"&&<div className="inp-wrap"><label className="label">Emne</label><input className="inp" value={commSubj} onChange={e=>setCommSubj(e.target.value)} style={{fontSize:13,minHeight:38}}/></div>}
          <div className="inp-wrap">
            <label className="label">Melding <span style={{color:"var(--faint)",fontWeight:400,textTransform:"none",letterSpacing:0}}>— [Navn] byttes ut automatisk</span></label>
            <textarea className="inp" value={commMsg} onChange={e=>setCommMsg(e.target.value)} rows={7} style={{fontSize:13,lineHeight:1.6,resize:"vertical"}}/>
          </div>
          {commGuests.length>1&&(
            <div style={{background:"var(--stone)",borderRadius:9,padding:"10px 12px",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:6}}>{commGuests.length} mottakere</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {commGuests.map(g=>(
                  <div key={g.id} style={{display:"flex",alignItems:"center",gap:4,background:"var(--white)",borderRadius:20,padding:"3px 10px 3px 6px",border:"1px solid var(--border)"}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:"var(--bronzeL)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"var(--bronze2)"}}>{g.first_name[0]}</div>
                    <span style={{fontSize:12}}>{g.first_name}</span>
                    {((commChan==="email"&&!g.email)||(commChan==="sms"&&!g.phone))&&<span style={{fontSize:10,color:"var(--red)"}}>✕</span>}
                  </div>
                ))}
              </div>
              {commGuests.filter(g=>commChan==="email"?!g.email:!g.phone).length>0&&<div style={{fontSize:11,color:"var(--amber)",marginTop:6}}>{commGuests.filter(g=>commChan==="email"?!g.email:!g.phone).length} mangler {commChan==="email"?"e-post":"telefon"} og hoppes over</div>}
            </div>
          )}
          <button className="btn btn-primary btn-full mb8" onClick={sendAll}>
            {commChan==="email"?"Åpne e-postklient":"Åpne SMS"}{commGuests.length>1?` for ${commGuests.filter(g=>commChan==="email"?!!g.email:!!g.phone).length} mottakere`:""}
          </button>
          {commGuests.length>1&&(
            <>
              <div className="label" style={{marginTop:4}}>Eller send enkeltvis</div>
              {commGuests.map(g=>(
                <div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{flex:1,fontSize:13,fontWeight:500}}>{g.first_name} {g.last_name}</div>
                  <div style={{fontSize:11,color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:140}}>{commChan==="email"?g.email:g.phone}</div>
                  <button onClick={()=>sendSingle(g)} style={{padding:"6px 12px",borderRadius:8,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:12,fontWeight:600,color:"var(--bronze2)",fontFamily:"'Inter',sans-serif",flexShrink:0}}>Send</button>
                </div>
              ))}
            </>
          )}
        </Sheet>
      )}

      {/* ── EDIT SHEET ── */}
      {editSheet&&draft&&(
        <Sheet title={guests.find(g=>g.id===draft.id)?"Rediger gjest":"Legg til gjest"} onClose={()=>setEditSheet(false)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div><label className="label">Fornavn</label><input className="inp" value={draft.first_name} onChange={e=>setDraft(d=>({...d,first_name:e.target.value}))} placeholder="Fornavn" autoFocus/></div>
            <div><label className="label">Etternavn</label><input className="inp" value={draft.last_name} onChange={e=>setDraft(d=>({...d,last_name:e.target.value}))} placeholder="Etternavn"/></div>
          </div>
          <div style={{marginBottom:14}}>
            <label className="label">Brudeparets side</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[{key:"brud",label:n1,color:"var(--bronze)",bg:"var(--bronzeL)"},{key:"felles",label:"Felles",color:"var(--muted)",bg:"var(--stone)"},{key:"brudgom",label:n2,color:"var(--sage)",bg:"var(--sageL)"}].map(s=>(
                <button key={s.key} onClick={()=>setDraft(d=>({...d,side_of_couple:s.key}))}
                  style={{padding:"10px 6px",borderRadius:9,border:`2px solid ${draft.side_of_couple===s.key?s.color:"var(--border)"}`,background:draft.side_of_couple===s.key?s.bg:"var(--white)",cursor:"pointer",textAlign:"center",transition:"all .15s",fontFamily:"'Inter',sans-serif"}}>
                  <div style={{fontSize:13,fontWeight:600,color:draft.side_of_couple===s.key?s.color:"var(--muted)"}}>{s.label}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="inp-wrap"><label className="label">E-post</label><input className="inp" type="email" value={draft.email||""} onChange={e=>setDraft(d=>({...d,email:e.target.value}))} placeholder="epost@eksempel.no"/></div>
          <div className="inp-wrap"><label className="label">Telefon</label><input className="inp" type="tel" value={draft.phone||""} onChange={e=>setDraft(d=>({...d,phone:e.target.value}))} placeholder="+47 000 00 000"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div><label className="label">Relasjon</label><select className="inp" value={draft.relation_category} onChange={e=>setDraft(d=>({...d,relation_category:e.target.value}))}>{RELATION_TYPES.map(r=><option key={r}>{r}</option>)}</select></div>
            <div><label className="label">RSVP-status</label><select className="inp" value={draft.rsvp_status} onChange={e=>setDraft(d=>({...d,rsvp_status:e.target.value}))}>{Object.entries(RSVP_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
          </div>
          <div className="inp-wrap"><label className="label">Allergier / matbehov</label><input className="inp" value={draft.allergies||""} onChange={e=>setDraft(d=>({...d,allergies:e.target.value}))} placeholder="f.eks. nøtter, gluten..."/></div>
          <div className="inp-wrap"><label className="label">Spesielle behov</label><input className="inp" value={draft.special_needs||""} onChange={e=>setDraft(d=>({...d,special_needs:e.target.value}))} placeholder="f.eks. rullestol..."/></div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,padding:"12px 16px",background:"var(--stone)",borderRadius:9}}>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>Tillat ledsager (+1)</div></div>
            <button onClick={()=>setDraft(d=>({...d,plus_one_allowed:!d.plus_one_allowed}))} style={{width:44,height:26,borderRadius:13,border:"none",background:draft.plus_one_allowed?"var(--green)":"var(--border)",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
              <div style={{position:"absolute",top:3,left:draft.plus_one_allowed?21:3,width:20,height:20,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
            </button>
          </div>
          {draft.plus_one_allowed&&<div className="inp-wrap"><label className="label">Ledsagers navn</label><input className="inp" value={draft.plus_one_name||""} onChange={e=>setDraft(d=>({...d,plus_one_name:e.target.value}))} placeholder="Navn på ledsager"/></div>}
          <div className="inp-wrap"><label className="label">Notater</label><textarea className="inp" value={draft.notes||""} onChange={e=>setDraft(d=>({...d,notes:e.target.value}))} placeholder="Interne notater..."/></div>
          {guests.find(g=>g.id===draft.id)&&(draft.email||draft.phone)&&(
            <div style={{marginBottom:14,padding:"12px 14px",background:"var(--stone)",borderRadius:10}}>
              <div className="label" style={{marginBottom:8}}>Kontakt denne gjesten</div>
              <div style={{display:"flex",gap:8}}>
                {draft.email&&<button className="btn btn-outline btn-sm" style={{flex:1}} onClick={()=>{setEditSheet(false);setCommTpl("invitation");applyTpl("invitation","email");setCommChan("email");openComm([draft]);}}>✉ E-post</button>}
                {draft.phone&&<button className="btn btn-outline btn-sm" style={{flex:1}} onClick={()=>{setEditSheet(false);setCommTpl("invitation");applyTpl("invitation","sms");setCommChan("sms");openComm([draft]);}}>SMS</button>}
              </div>
            </div>
          )}
          <button className="btn btn-primary btn-full mb8" onClick={save}>Lagre</button>
          {guests.find(g=>g.id===draft.id)&&<button className="btn btn-outline btn-full" style={{color:"var(--red)",borderColor:"var(--red)"}} onClick={del}>Fjern gjest</button>}
        </Sheet>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   KOMMUNIKASJON — SMS / E-post til gjester
═══════════════════════════════════════════════════════════ */
function Communication({ guests, wedding, showToast }) {
  const [tab, setTab]         = useState("send");       // "send" | "history"
  const [channel, setChannel] = useState("email");      // "email" | "sms"
  const [msgType, setMsgType] = useState("invitation"); // template key
  const [recipient, setRecipient] = useState("all");    // "all"|"pending"|"accepted"|"custom"
  const [customIds, setCustomIds] = useState([]);
  const [msgBody, setMsgBody]     = useState("");
  const [subject, setSubject]     = useState("");
  const [sent, setSent]           = useState([]);       // history
  const [preview, setPreview]     = useState(false);

  const n1 = wedding?.name1 || "Brudeparet";
  const n2 = wedding?.name2 || "";
  const coupleName = n2 ? `${n1} & ${n2}` : n1;
  const wDate = wedding?.date
    ? new Date(wedding.date).toLocaleDateString("nb-NO",{day:"numeric",month:"long",year:"numeric"})
    : "dato ikke satt";
  const wVenue = wedding?.venue || wedding?.city || "lokalet";
  const portalUrl = `${n1.toLowerCase()}og${n2.toLowerCase()}.bryllup.no`;

  const TEMPLATES = {
    invitation: {
      label: "Invitasjon",
      subject: `Invitasjon til bryllupet til ${coupleName}`,
      email: `Kjære [Navn],

Vi har gleden av å invitere deg til vårt bryllup!

${coupleName} gifter seg ${wDate} på ${wVenue}.

Du kan bekrefte din deltakelse og oppgi matpreferanser på vår bryllupsportal:
${portalUrl}

Vi håper du kan komme — og gleder oss til å feire denne spesielle dagen med deg.

Med kjærlig hilsen,
${coupleName}`,
      sms: `Hei! ${coupleName} gifter seg ${wDate} på ${wVenue}, og vi ønsker deg hjertelig velkommen! Svar på invitasjonen her: ${portalUrl} 🥂`,
    },
    reminder: {
      label: "RSVP-påminnelse",
      subject: `Påminnelse: Svar på invitasjonen fra ${coupleName}`,
      email: `Kjære [Navn],

Vi vil minne om at vi fortsatt venter på ditt svar angående bryllupet vårt.

${coupleName} gifter seg ${wDate} på ${wVenue}.

Vennligst bekreft eller avslå din deltakelse på:
${portalUrl}

Vi setter stor pris på at du svarer innen [frist].

Med vennlig hilsen,
${coupleName}`,
      sms: `Hei [Navn]! Vennlig påminnelse om å svare på bryllupsinnbydelsen vår. ${coupleName}, ${wDate}. Svar her: ${portalUrl}`,
    },
    practical: {
      label: "Praktisk info",
      subject: `Praktisk informasjon — bryllupet til ${coupleName}`,
      email: `Kjære [Navn],

Her er litt praktisk informasjon om bryllupet vårt:

📅 Dato: ${wDate}
📍 Sted: ${wVenue}
🕐 Vielse starter kl. 14:00 (vær på plass 30 min før)
👗 Kleskode: ${wedding?.dress || "Ikke oppgitt"}

Veibeskrivelse og mer info finner du på:
${portalUrl}

Ser frem til å feire med deg!

${coupleName}`,
      sms: `Hei! Praktisk info om bryllupet ${wDate}: Vielse kl 14:00 på ${wVenue}. Kleskode: ${wedding?.dress || "ikke oppgitt"}. Mer info: ${portalUrl}`,
    },
    thankyou: {
      label: "Takkemelding",
      subject: `Tusen takk fra ${coupleName}!`,
      email: `Kjære [Navn],

Tusen hjertelig takk for at du delte den spesielle dagen vår med oss!

Det betydde enormt mye å ha deg der, og vi kommer til å bære med oss minner fra den dagen for resten av livet.

Bilder og mer fra bryllupet deles snart på:
${portalUrl}

Med varmeste klem,
${coupleName}`,
      sms: `Hei [Navn]! Tusen takk for at du feiret med oss! Det betydde så mye. Bilder kommer snart. Klem fra ${coupleName} ❤️`,
    },
    custom: {
      label: "Egendefinert",
      subject: "",
      email: "",
      sms: "",
    },
  };

  // Derive recipient list
  const getRecipients = () => {
    let list = guests;
    if (recipient==="pending")  list = guests.filter(g=>g.rsvp_status==="pending"||g.rsvp_status==="invited"||g.rsvp_status==="not_invited");
    if (recipient==="accepted") list = guests.filter(g=>g.rsvp_status==="accepted");
    if (recipient==="custom")   list = guests.filter(g=>customIds.includes(g.id));
    return list.filter(g => channel==="email" ? !!g.email : !!g.phone);
  };
  const recipients = getRecipients();

  // When template or channel changes, fill the body
  React.useEffect(() => {
    const t = TEMPLATES[msgType];
    if (!t) return;
    if (msgType!=="custom") {
      setMsgBody(channel==="email" ? t.email : t.sms);
      setSubject(t.subject||"");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgType, channel]);

  const openAll = () => {
    if (recipients.length === 0) { showToast("Ingen mottakere med " + (channel==="email"?"e-post":"telefonnummer")); return; }
    const body = encodeURIComponent(msgBody);
    const sub  = encodeURIComponent(subject);

    if (channel==="email") {
      const to = recipients.map(g=>g.email).filter(Boolean).join(",");
      window.open(`mailto:${to}?subject=${sub}&body=${body}`);
    } else {
      // SMS: open one by one (mobile) or show list
      recipients.forEach((g, i) => {
        setTimeout(() => {
          window.open(`sms:${g.phone}?body=${body}`);
        }, i*300);
      });
    }

    // Log to history
    const entry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString("nb-NO"),
      type: TEMPLATES[msgType]?.label || "Melding",
      channel,
      count: recipients.length,
      names: recipients.slice(0,3).map(g=>`${g.first_name} ${g.last_name}`).join(", ")+(recipients.length>3?` +${recipients.length-3}`:""),
    };
    setSent(prev=>[entry,...prev]);
    showToast(`Åpner ${channel==="email"?"e-postklient":"SMS"} for ${recipients.length} mottakere`);
  };

  const openSingle = (g) => {
    const body = encodeURIComponent(msgBody.replace("[Navn]", g.first_name));
    const sub  = encodeURIComponent(subject);
    if (channel==="email" && g.email) {
      window.open(`mailto:${g.email}?subject=${sub}&body=${body}`);
    } else if (channel==="sms" && g.phone) {
      window.open(`sms:${g.phone}?body=${body}`);
    } else {
      showToast(`${g.first_name} mangler ${channel==="email"?"e-post":"telefonnummer"}`);
    }
  };

  const missingContact = guests.filter(g => channel==="email" ? !g.email : !g.phone).length;

  return (
    <div className="fade-up">
      <div className="page-wrap">
        <div className="page-header">
          <div className="page-kicker">Kommunikasjon</div>
          <div className="h1">SMS & E-post</div>
          <div className="p-muted">Send invitasjoner, påminnelser og meldinger direkte til gjestene</div>
        </div>

        {/* Tab bar */}
        <div style={{display:"flex",background:"var(--stone)",borderRadius:10,padding:4,marginBottom:16}}>
          {[{k:"send",l:"Send melding"},{k:"history",l:`Historikk (${sent.length})`}].map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)}
              style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:tab===t.k?"var(--white)":"transparent",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,color:tab===t.k?"var(--text)":"var(--muted)",cursor:"pointer",boxShadow:tab===t.k?"0 1px 4px rgba(0,0,0,.1)":"none",transition:"all .15s"}}>
              {t.l}
            </button>
          ))}
        </div>

        {tab==="send" && (
          <>
            {/* Channel picker */}
            <div className="card" style={{padding:"14px 16px",marginBottom:10}}>
              <div className="label" style={{marginBottom:8}}>Kanal</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[{k:"email",l:"E-post",icon:"✉"},{k:"sms",l:"SMS",icon:"◻"}].map(c=>(
                  <button key={c.k} onClick={()=>setChannel(c.k)}
                    style={{padding:"12px",borderRadius:10,border:`2px solid ${channel===c.k?"var(--bronze)":"var(--border)"}`,background:channel===c.k?"var(--bronzeL)":"var(--white)",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,color:channel===c.k?"var(--bronze2)":"var(--muted)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .15s"}}>
                    <span style={{fontSize:18}}>{c.icon}</span>{c.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Template picker */}
            <div className="card" style={{padding:"14px 16px",marginBottom:10}}>
              <div className="label" style={{marginBottom:8}}>Maltype</div>
              <div className="chips" style={{marginBottom:0}}>
                {Object.entries(TEMPLATES).map(([k,t])=>(
                  <button key={k} className={`chip ${msgType===k?"on":""}`} onClick={()=>setMsgType(k)}>{t.label}</button>
                ))}
              </div>
            </div>

            {/* Recipients */}
            <div className="card" style={{padding:"14px 16px",marginBottom:10}}>
              <div className="label" style={{marginBottom:8}}>Mottakere</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
                {[
                  {k:"all",      l:"Alle gjester",       n:guests.length},
                  {k:"pending",  l:"Ikke svart ennå",    n:guests.filter(g=>g.rsvp_status!=="accepted"&&g.rsvp_status!=="declined").length},
                  {k:"accepted", l:"Bekreftet",          n:guests.filter(g=>g.rsvp_status==="accepted").length},
                  {k:"custom",   l:"Velg selv",          n:customIds.length},
                ].map(r=>(
                  <button key={r.k} onClick={()=>setRecipient(r.k)}
                    style={{padding:"10px 12px",borderRadius:9,border:`1.5px solid ${recipient===r.k?"var(--bronze)":"var(--border)"}`,background:recipient===r.k?"var(--bronzeL)":"var(--white)",cursor:"pointer",fontFamily:"'Inter',sans-serif",textAlign:"left",transition:"all .15s"}}>
                    <div style={{fontSize:13,fontWeight:600,color:recipient===r.k?"var(--bronze2)":"var(--text)"}}>{r.l}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{r.n} stk</div>
                  </button>
                ))}
              </div>

              {recipient==="custom" && (
                <div style={{maxHeight:160,overflowY:"auto",border:"1px solid var(--border)",borderRadius:8,padding:"4px 0"}}>
                  {guests.map(g=>{
                    const checked = customIds.includes(g.id);
                    return (
                      <div key={g.id} onClick={()=>setCustomIds(prev=>checked?prev.filter(id=>id!==g.id):[...prev,g.id])}
                        style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",cursor:"pointer",background:checked?"var(--bronzeL)":"transparent"}}>
                        <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${checked?"var(--bronze)":"var(--border)"}`,background:checked?"var(--bronze)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {checked&&<span style={{color:"white",fontSize:10,fontWeight:700}}>✓</span>}
                        </div>
                        <span style={{fontSize:13}}>{g.first_name} {g.last_name}</span>
                        {(!g.email&&channel==="email")||(!g.phone&&channel==="sms")
                          ? <span style={{fontSize:10,color:"var(--red)",marginLeft:"auto"}}>mangler</span>
                          : null}
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,fontSize:12}}>
                <span style={{color:"var(--muted)"}}>{recipients.length} av {guests.length} har {channel==="email"?"e-post":"telefon"}</span>
                {missingContact>0&&<span style={{color:"var(--amber)"}}>{missingContact} mangler kontaktinfo</span>}
              </div>
            </div>

            {/* Message editor */}
            <div className="card" style={{padding:"14px 16px",marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div className="label" style={{marginBottom:0}}>Melding</div>
                <button onClick={()=>setPreview(p=>!p)}
                  style={{fontSize:11,color:"var(--bronze)",background:"none",border:"none",cursor:"pointer",fontWeight:600,fontFamily:"'Inter',sans-serif"}}>
                  {preview?"Rediger":"Forhåndsvis"}
                </button>
              </div>

              {channel==="email" && (
                <div style={{marginBottom:8}}>
                  <input className="inp" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Emne..." style={{fontSize:13,minHeight:36,padding:"8px 12px",marginBottom:0}}/>
                </div>
              )}

              {preview ? (
                <div style={{background:"var(--stone)",borderRadius:8,padding:"12px 14px",fontSize:13,lineHeight:1.7,whiteSpace:"pre-wrap",color:"var(--text)",minHeight:120,border:"1px solid var(--border)"}}>
                  {msgBody || <span style={{color:"var(--faint)"}}>Ingen melding ennå</span>}
                </div>
              ) : (
                <textarea className="inp" value={msgBody} onChange={e=>setMsgBody(e.target.value)}
                  placeholder="Skriv meldingen her..." rows={8}
                  style={{fontSize:13,lineHeight:1.6,resize:"vertical",minHeight:140}}/>
              )}
              <div style={{fontSize:11,color:"var(--muted)",marginTop:6}}>
                Tips: Bruk [Navn] for å sette inn fornavnet automatisk
              </div>
            </div>

            {/* Send button */}
            <button className="btn btn-primary btn-full" onClick={openAll}
              style={{marginBottom:8,fontSize:15,minHeight:52}}>
              {channel==="email" ? "✉ Åpne e-postklient" : "◻ Åpne SMS-app"} for {recipients.length} mottakere
            </button>

            {/* Individual send list */}
            {recipients.length>0&&(
              <div className="card-flush" style={{marginBottom:10}}>
                <div style={{padding:"10px 16px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:12,fontWeight:600,color:"var(--muted)",letterSpacing:".06em",textTransform:"uppercase"}}>Send enkeltvis</div>
                </div>
                <div style={{padding:"0 16px"}}>
                  {recipients.slice(0,15).map(g=>(
                    <div key={g.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:"var(--bronzeL)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"var(--bronze2)",flexShrink:0}}>
                        {initials(`${g.first_name} ${g.last_name}`)}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.first_name} {g.last_name}</div>
                        <div style={{fontSize:11,color:"var(--muted)"}}>{channel==="email"?g.email:g.phone}</div>
                      </div>
                      <button onClick={()=>openSingle(g)}
                        style={{padding:"6px 12px",borderRadius:8,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif",fontWeight:600,color:"var(--bronze2)",whiteSpace:"nowrap",flexShrink:0}}>
                        {channel==="email"?"Send e-post":"Send SMS"}
                      </button>
                    </div>
                  ))}
                  {recipients.length>15&&<div style={{padding:"10px 0",fontSize:12,color:"var(--muted)",textAlign:"center"}}>...og {recipients.length-15} til</div>}
                </div>
              </div>
            )}
          </>
        )}

        {tab==="history" && (
          <>
            {sent.length===0
              ? <EmptyState title="Ingen sendte meldinger" sub="Meldinger du sender vises her som en logg." cta={null}/>
              : (
                <div className="card-flush">
                  <div style={{padding:"0 20px"}}>
                    {sent.map(s=>(
                      <div key={s.id} style={{padding:"14px 0",borderBottom:"1px solid var(--border)"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                          <div style={{fontWeight:600,fontSize:14,color:"var(--text)"}}>{s.type}</div>
                          <div style={{fontSize:10,color:"var(--muted)",letterSpacing:".04em",flexShrink:0,marginLeft:8}}>{s.timestamp}</div>
                        </div>
                        <div style={{fontSize:12,color:"var(--muted)"}}>
                          {s.channel==="email"?"E-post":"SMS"} · {s.count} mottakere: {s.names}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
          </>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   VENDORS
═══════════════════════════════════════════════════════════ */
function Vendors({ vendors: myVendors, setVendors: setMyVendors, showToast, wedding, chats: chatsProp, setChats: setChatsProp }) {
  const [chatsLocal, setChatsLocal] = useState({});
  const chats    = chatsProp    !== undefined ? chatsProp    : chatsLocal;
  const setChats = setChatsProp !== undefined ? setChatsProp : setChatsLocal;

  const [screen,     setScreen]     = useState("home");
  const [selCat,     setSelCat]     = useState(null);
  const [selVendor,  setSelVendor]  = useState(null);
  const [prevScreen, setPrevScreen] = useState(null);
  const [search,     setSearch]     = useState("");
  const [filterPri,  setFilterPri]  = useState(null);
  const [filterSty,  setFilterSty]  = useState(null);
  const [sort,       setSort]       = useState("relevans");
  const [catalog]                   = useState(DEMO_VENDOR_CATALOG);
  const [editSheet,  setEditSheet]  = useState(false);
  const [editDraft,  setEditDraft]  = useState(null);
  const [profileTab, setProfileTab] = useState("om");
  const [chatMsg,    setChatMsg]    = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [selVendor, chats, screen]);

  const STATUS_LABELS = {exploring:"Utforsker", favoritt:"Favoritt ★", vurderes:"Vurderes", kontaktet:"Kontaktet", valgt:"Valgt", booket:"Booket ✓"};
  const STATUS_COLORS = {
    exploring: ["var(--muted)",   "var(--stone)"],
    favoritt:  ["var(--bronze)",  "var(--bronzeL)"],
    vurderes:  ["#4A6E8A",        "#E4EEF5"],
    kontaktet: ["var(--amber)",   "rgba(196,128,58,.1)"],
    valgt:     ["#6A7A4A",        "#EAF0DA"],
    booket:    ["var(--green)",   "var(--greenL)"],
  };

  const getMyV     = id => myVendors.find(v => v.id === id);
  const getStatus  = id => getMyV(id)?.status || "exploring";

  const stTag = (id) => {
    const s = getStatus(id);
    const [c, b] = STATUS_COLORS[s] || STATUS_COLORS.exploring;
    return <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:b,color:c}}>{STATUS_LABELS[s] || s}</span>;
  };

  const toggleFav = (v) => {
    const existing = getMyV(v.id);
    if (existing) {
      setMyVendors(prev => prev.map(x => x.id===v.id ? {...x, status: x.status==="favoritt"?"exploring":"favoritt"} : x));
      showToast(existing.status==="favoritt" ? "Fjernet fra favoritter" : "Lagret som favoritt ★");
    } else {
      setMyVendors(prev => [...prev, {...v, status:"favoritt", notes:"", partnerNote:"", reaction:"", price_estimate:v.price||0, price_actual:0}]);
      showToast("Lagret som favoritt ★");
    }
  };

  const setStatus = (v, status) => {
    const existing = getMyV(v.id);
    if (existing) setMyVendors(prev => prev.map(x => x.id===v.id ? {...x, status} : x));
    else setMyVendors(prev => [...prev, {...v, status, notes:"", partnerNote:"", reaction:"", price_estimate:v.price||0, price_actual:0}]);
    if (selVendor?.id === v.id) setSelVendor(sv => ({...sv, status}));
    showToast("Status: " + (STATUS_LABELS[status] || status));
  };

  const updateNote = (id, field, val) => {
    setMyVendors(prev => prev.map(v => v.id===id ? {...v, [field]:val} : v));
  };

  const sendChat = () => {
    if (!chatMsg.trim() || !selVendor) return;
    const msg = {id:Date.now(), from:"planner", text:chatMsg.trim(), ts:new Date().toLocaleTimeString("nb-NO",{hour:"2-digit",minute:"2-digit"})};
    setChats(c => ({...c, [selVendor.id]: [...(c[selVendor.id]||[]), msg]}));
    setChatMsg("");
    setTimeout(() => {
      const reply = {id:Date.now()+1, from:"vendor", text:"Hei! Takk for meldingen. Vi kommer tilbake til dere snart.", ts:new Date().toLocaleTimeString("nb-NO",{hour:"2-digit",minute:"2-digit"})};
      setChats(c => ({...c, [selVendor.id]: [...(c[selVendor.id]||[]), reply]}));
    }, 1800);
  };

  const catFiltered = selCat ? catalog.filter(v => v.cat===selCat) : catalog;
  const filtered = catFiltered.filter(v => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.city.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterPri==="low"  && v.price > 30000) return false;
    if (filterPri==="mid"  && (v.price < 30000 || v.price > 80000)) return false;
    if (filterPri==="high" && v.price < 80000) return false;
    if (filterSty && !v.style?.includes(filterSty)) return false;
    return true;
  }).sort((a,b) => sort==="pris" ? a.price-b.price : sort==="rating" ? b.rating-a.rating : (b.featured?1:0)-(a.featured?1:0));

  const favs   = myVendors.filter(v => v.status==="favoritt");
  const booked = myVendors.filter(v => v.status==="booket" || v.status==="valgt");

  const VCard = ({v, compact=false}) => {
    const st = getStatus(v.id);
    const isFav = st==="favoritt";
    const msgCount = (chats[v.id]||[]).length;
    return (
      <div style={{background:"var(--white)",borderRadius:14,border:"1px solid var(--border)",marginBottom:10,overflow:"hidden",cursor:"pointer"}}
        onClick={() => { setSelVendor({...v, ...getMyV(v.id)||{}}); setPrevScreen(screen); setScreen("profile"); setProfileTab("om"); }}>
        {!compact && (
          <div style={{height:90,background:"linear-gradient(135deg,"+v.gallery[0]+","+v.gallery[1]+","+v.gallery[2]+")",position:"relative",display:"flex",alignItems:"flex-end",padding:"8px 12px"}}>
            <div style={{display:"flex",gap:4}}>
              {v.verified && <span style={{background:"rgba(255,255,255,.9)",color:"#3A3028",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:10}}>VERIFISERT</span>}
              {v.fast && <span style={{background:"rgba(74,124,92,.9)",color:"white",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:10}}>RASK SVAR</span>}
            </div>
            <button onClick={e => { e.stopPropagation(); toggleFav(v); }}
              style={{position:"absolute",top:8,right:8,width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,.85)",border:"none",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {isFav ? "★" : "☆"}
            </button>
          </div>
        )}
        <div style={{padding:compact?"10px 12px":"12px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:compact?14:17,fontWeight:500,color:"var(--text)"}}>{v.name}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{v.city} · {VENDOR_CATEGORIES_FULL.find(c=>c.id===v.cat)?.label}</div>
            </div>
            {stTag(v.id)}
          </div>
          {!compact && <div style={{fontSize:12,color:"var(--muted)",marginBottom:8,lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{v.desc}</div>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:12,fontSize:12}}>
              <span style={{fontWeight:600,color:"var(--text)"}}>{v.priceLabel}</span>
              <span style={{color:"var(--muted)"}}>★ {v.rating} ({v.reviews})</span>
            </div>
            {msgCount > 0 && <span style={{fontSize:10,background:"var(--bronzeL)",color:"var(--bronze2)",borderRadius:10,padding:"2px 8px",fontWeight:600}}>{msgCount} msg</span>}
          </div>
        </div>
      </div>
    );
  };

  const BackBtn = ({to}) => (
    <button onClick={() => setScreen(to || prevScreen || "home")}
      style={{background:"var(--stone)",border:"1px solid var(--border)",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,fontWeight:700,color:"var(--text)",flexShrink:0}}>
      ←
    </button>
  );

  /* HOME */
  if (screen === "home") return (
    <div className="fade-up">
      <div className="page-wrap">
        <div className="page-header">
          <div className="page-kicker">Leverandører</div>
          <div className="h1">Finn din drømmeteam</div>
          <div className="p-muted">Oppdage, vurder og book alle du trenger.</div>
        </div>
        <div style={{position:"relative",marginBottom:16}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15,color:"var(--muted)"}}>🔍</span>
          <input className="inp" style={{paddingLeft:36,fontSize:14}} placeholder="Søk lokale, fotograf, by…"
            value={search} onChange={e => { setSearch(e.target.value); if(e.target.value) { setSelCat(null); setScreen("results"); }}}/>
        </div>
        <div className="label" style={{marginBottom:8}}>Kategorier</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
          {VENDOR_CATEGORIES_FULL.map(c => (
            <button key={c.id} onClick={() => { setSelCat(c.id); setSearch(""); setScreen("results"); }}
              style={{padding:"14px 8px",borderRadius:12,border:"1.5px solid var(--border)",background:c.color,cursor:"pointer",textAlign:"center",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>
              <div style={{fontSize:24,marginBottom:4}}>{c.icon}</div>
              <div style={{fontSize:11,fontWeight:600,color:"var(--text)",lineHeight:1.3}}>{c.label}</div>
              <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{catalog.filter(v=>v.cat===c.id).length} stk</div>
            </button>
          ))}
        </div>
        {booked.length > 0 && (
          <div style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div className="label">Valgt & booket ({booked.length})</div>
              <button onClick={() => setScreen("favorites")} style={{fontSize:12,color:"var(--bronze)",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Se alle</button>
            </div>
            {booked.slice(0,2).map(v => <VCard key={v.id} v={v} compact/>)}
          </div>
        )}
        {favs.length > 0 && (
          <div style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div className="label">Favoritter ({favs.length})</div>
              <button onClick={() => setScreen("favorites")} style={{fontSize:12,color:"var(--bronze)",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Se alle</button>
            </div>
            {favs.slice(0,2).map(v => <VCard key={v.id} v={v} compact/>)}
          </div>
        )}
        <div className="label" style={{marginBottom:8}}>Fremhevet</div>
        {catalog.filter(v => v.featured).slice(0,3).map(v => <VCard key={v.id} v={v}/>)}
        <button className="btn btn-outline btn-full" style={{marginTop:8}} onClick={() => {
          setEditDraft({id:Date.now().toString(),name:"",cat:"fotograf",city:"Oslo",price:0,priceLabel:"",rating:0,reviews:0,verified:false,featured:false,fast:false,style:[],cap:0,desc:"",tags:[],gallery:["#F5EDD8","#EDE4D0","#D8CCB8"],status:"vurderes",contact_name:"",email:"",phone:"",website:"",notes:"",partnerNote:"",price_estimate:0,price_actual:0});
          setEditSheet(true);
        }}>+ Legg til leverandør manuelt</button>
      </div>
      {editSheet && editDraft && (
        <Sheet title="Legg til leverandør" onClose={() => setEditSheet(false)}>
          <EditSheetContent d={editDraft} setD={setEditDraft} isNew onSave={() => { setMyVendors(p=>[...p,{...editDraft,status:"vurderes"}]); setEditSheet(false); showToast("Lagt til"); }} onDel={null}/>
        </Sheet>
      )}
    </div>
  );

  /* RESULTS */
  if (screen === "results") {
    const catInfo = VENDOR_CATEGORIES_FULL.find(c => c.id===selCat);
    return (
      <div className="fade-up">
        <div className="page-wrap">
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14,marginTop:8}}>
            <BackBtn to="home"/>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:500}}>{catInfo ? catInfo.icon+" "+catInfo.label : search ? "Søk: "+search : "Alle"}</div>
              <div style={{fontSize:12,color:"var(--muted)"}}>{filtered.length} resultater</div>
            </div>
          </div>
          <input className="inp" style={{fontSize:13,marginBottom:10}} placeholder="Søk…" value={search} onChange={e=>setSearch(e.target.value)}/>
          <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",paddingBottom:6,marginBottom:10}}>
            {[{k:null,l:"Alle"},{k:"low",l:"Under 30k"},{k:"mid",l:"30–80k"},{k:"high",l:"Over 80k"}].map(f => (
              <button key={f.k||"all"} onClick={() => setFilterPri(f.k)} className={"chip "+(filterPri===f.k?"on":"")}>{f.l}</button>
            ))}
            {["klassisk","romantisk","natur","luksus"].map(s => (
              <button key={s} onClick={() => setFilterSty(filterSty===s?null:s)} className={"chip "+(filterSty===s?"on":"")}>{s}</button>
            ))}
            {["relevans","rating","pris"].map(s => (
              <button key={s} onClick={() => setSort(s)} className={"chip "+(sort===s?"on":"")}>{"↕ "+s}</button>
            ))}
          </div>
          {filtered.length === 0
            ? <EmptyState title="Ingen resultater" sub="Prøv å justere søk eller filtre." cta={null}/>
            : filtered.map(v => <VCard key={v.id} v={v}/>)
          }
        </div>
      </div>
    );
  }

  /* FAVORITES */
  if (screen === "favorites") return (
    <div className="fade-up">
      <div className="page-wrap">
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14,marginTop:8}}>
          <BackBtn to="home"/>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:500}}>Favoritter & shortlist</div>
            <div style={{fontSize:12,color:"var(--muted)"}}>{myVendors.length} lagrede</div>
          </div>
        </div>
        {myVendors.length === 0
          ? <EmptyState title="Ingen lagret ennå" sub="Trykk ★ på en leverandør for å lagre den her." cta="Utforsk" onCta={() => setScreen("home")}/>
          : Object.entries(myVendors.reduce((g,v) => { const s=v.status||"exploring"; (g[s]=g[s]||[]).push(v); return g; }, {})).map(([s,list]) => (
            <div key={s} style={{marginBottom:16}}>
              <div className="label" style={{marginBottom:8}}>{STATUS_LABELS[s]||s} ({list.length})</div>
              {list.map(v => <VCard key={v.id} v={v} compact/>)}
            </div>
          ))
        }
      </div>
    </div>
  );

  /* PROFILE */
  if (screen === "profile" && selVendor) {
    const v = selVendor;
    const myV = getMyV(v.id);
    const st = getStatus(v.id);
    const msgs = chats[v.id] || [];
    const catInfo = VENDOR_CATEGORIES_FULL.find(c => c.id===v.cat);
    const PTABS = [{id:"om",l:"Om"},{id:"galleri",l:"Galleri 📸"},{id:"tjenester",l:"Tjenester"},{id:"anmeldelser",l:"Anmeldelser"},{id:"notater",l:"Notater"},{id:"kobling",l:"Plan"}];
    const [c0,] = STATUS_COLORS[st] || STATUS_COLORS.exploring;
    return (
      <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
        <div style={{flexShrink:0,height:110,background:"linear-gradient(135deg,"+v.gallery[0]+","+v.gallery[1]+","+v.gallery[2]+")",position:"relative",display:"flex",alignItems:"flex-end",padding:"10px 14px"}}>
          <button onClick={() => setScreen(prevScreen||"home")} style={{position:"absolute",top:10,left:10,background:"rgba(255,255,255,.85)",border:"none",borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,fontWeight:700}}>←</button>
          <button onClick={() => toggleFav(v)} style={{position:"absolute",top:10,right:10,background:"rgba(255,255,255,.85)",border:"none",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16}}>
            {st==="favoritt"?"★":"☆"}
          </button>
          <div style={{display:"flex",gap:4}}>
            {v.verified && <span style={{background:"rgba(255,255,255,.9)",color:"#3A3028",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:10}}>VERIFISERT</span>}
            {v.fast && <span style={{background:"rgba(74,124,92,.9)",color:"white",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:10}}>RASK SVAR</span>}
          </div>
        </div>
        <div style={{flexShrink:0,background:"var(--white)",borderBottom:"1px solid var(--border)",padding:"12px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:500}}>{v.name}</div>
              <div style={{fontSize:12,color:"var(--muted)",marginTop:1}}>{catInfo?.label} · {v.city} · ★ {v.rating} ({v.reviews})</div>
              <div style={{fontSize:13,fontWeight:600,color:"var(--bronze)",marginTop:3}}>{v.priceLabel}</div>
            </div>
            {stTag(v.id)}
          </div>
          <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none"}}>
            <button onClick={() => { setPrevScreen("profile"); setScreen("chat"); }}
              style={{padding:"7px 12px",borderRadius:8,border:"1.5px solid var(--border)",background:"var(--stone)",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'Inter',sans-serif",flexShrink:0,display:"flex",gap:4,alignItems:"center"}}>
              {"💬 "+(msgs.length>0 ? "Chat ("+msgs.length+")" : "Send forespørsel")}
            </button>
            {["vurderes","kontaktet","valgt","booket"].map(s => (
              <button key={s} onClick={() => setStatus(v,s)}
                style={{padding:"7px 12px",borderRadius:8,border:"1.5px solid "+(st===s?"var(--bronze)":"var(--border)"),background:st===s?"var(--bronzeL)":"var(--white)",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'Inter',sans-serif",flexShrink:0,color:st===s?"var(--bronze2)":"var(--muted)",whiteSpace:"nowrap"}}>
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <div style={{flexShrink:0,display:"flex",background:"var(--white)",borderBottom:"1px solid var(--border)",overflowX:"auto",scrollbarWidth:"none"}}>
          {PTABS.map(t => (
            <button key={t.id} onClick={() => setProfileTab(t.id)}
              style={{flexShrink:0,padding:"10px 13px",border:"none",background:"transparent",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:11,cursor:"pointer",color:profileTab===t.id?"var(--bronze)":"var(--muted)",borderBottom:"2px solid "+(profileTab===t.id?"var(--bronze)":"transparent"),whiteSpace:"nowrap"}}>
              {t.l}
            </button>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
          {profileTab==="om" && (
            <>
              <div style={{fontSize:14,lineHeight:1.75,color:"var(--text)",marginBottom:12}}>{v.desc}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
                {(v.tags||[]).map(t => <span key={t} style={{fontSize:11,background:"var(--stone)",borderRadius:20,padding:"4px 10px"}}>{t}</span>)}
              </div>
              {[["Lokasjon",v.city],["Rating","★ "+v.rating+" ("+v.reviews+" anmeldelser)"],["Stil",(v.style||[]).join(", ")||"—"],["Pris",v.priceLabel],["Kapasitet",v.cap>0?"Opp til "+v.cap+" gjester":"Fleksibelt"]].map(([l,val]) => (
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{fontSize:11,color:"var(--muted)",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase"}}>{l}</span>
                  <span style={{fontSize:13,fontWeight:500,textAlign:"right",maxWidth:"55%"}}>{val}</span>
                </div>
              ))}
            </>
          )}
          {profileTab==="galleri" && (() => {
            const portfolio = v.portfolio || [];
            const [selAlbum, setSelAlbum] = useState(null);
            const [selImg,   setSelImg]   = useState(null);
            if (selImg && selAlbum) return (
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,padding:20}} onClick={()=>setSelImg(null)}>
                <div style={{borderRadius:20,overflow:"hidden",background:selImg.c,width:"100%",maxWidth:380,aspectRatio:"4/3",display:"flex",alignItems:"center",justifyContent:"center",fontSize:80}}>{selImg.e}</div>
                <div style={{fontSize:14,color:"rgba(255,255,255,.85)",textAlign:"center"}}>{selImg.cap}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>Trykk for å lukke</div>
              </div>
            );
            return portfolio.length===0 ? (
              <div style={{textAlign:"center",padding:"40px 20px",color:"var(--muted)"}}>
                <div style={{fontSize:36,marginBottom:8}}>📷</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,marginBottom:4}}>Ingen bilder ennå</div>
                <div style={{fontSize:13}}>Leverandøren har ikke lagt til bilder.</div>
              </div>
            ) : (
              <div>
                {selAlbum ? (
                  <>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:14}}>
                      <button onClick={()=>setSelAlbum(null)} style={{background:"var(--stone)",border:"1px solid var(--border)",borderRadius:8,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:13,fontWeight:700,flexShrink:0}}>←</button>
                      <div>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16}}>{selAlbum.title}</div>
                        <div style={{fontSize:11,color:"var(--muted)"}}>{selAlbum.imgs.length} bilder</div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {selAlbum.imgs.map((img,i)=>(
                        <div key={i} onClick={()=>setSelImg(img)} style={{borderRadius:12,background:img.c,aspectRatio:"4/3",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",border:"1px solid var(--border)"}}>
                          <div style={{fontSize:40,marginBottom:6}}>{img.e}</div>
                          {img.cap&&<div style={{fontSize:10,color:"rgba(0,0,0,.5)",textAlign:"center",padding:"0 6px"}}>{img.cap}</div>}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{fontSize:13,color:"var(--muted)",marginBottom:12}}>{portfolio.reduce((s,a)=>s+a.imgs.length,0)} bilder i {portfolio.length} album</div>
                    {portfolio.map(album=>(
                      <div key={album.id} onClick={()=>setSelAlbum(album)} style={{background:"var(--white)",borderRadius:14,border:"1px solid var(--border)",overflow:"hidden",marginBottom:10,cursor:"pointer"}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",height:100,overflow:"hidden"}}>
                          {album.imgs.slice(0,4).map((img,i)=>(
                            <div key={i} style={{background:img.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:i===0?36:24,borderRight:i%2===0?"1px solid var(--border)":"none",borderBottom:i<2?"1px solid var(--border)":"none"}}>{img.e}</div>
                          ))}
                        </div>
                        <div style={{padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontSize:14,fontWeight:600}}>{album.title}</div>
                            <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{album.imgs.length} bilder</div>
                          </div>
                          <span style={{fontSize:10,background:"var(--bronzeL)",color:"var(--bronze2)",borderRadius:20,padding:"3px 8px",fontWeight:600}}>{album.tag}</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })()}

          {profileTab==="tjenester" && (
            <>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,marginBottom:12}}>Tjenester & pakker</div>
              {[["Grunnpakke",v.price*0.7,["4t fotografering","100+ bilder","Digitalt galleri"],false],["Standardpakke",v.price,["8t fotografering","300+ bilder","Trykt album","Prøvetime"],true],["Premiumpakke",v.price*1.4,["Hel dag","500+ bilder","Video","2 fotografer"],false]].map(([name,price,inc,best]) => (
                <div key={name} style={{background:best?"var(--bronzeL)":"var(--white)",border:"1.5px solid "+(best?"var(--bronze)":"var(--border)"),borderRadius:12,padding:"14px",marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:15}}>{name}</div>
                    <div style={{fontSize:14,fontWeight:700,color:"var(--bronze)"}}>{fmtKr(Math.round(price/1000)*1000)}</div>
                  </div>
                  {best && <span style={{fontSize:9,background:"var(--bronze)",color:"white",borderRadius:20,padding:"2px 8px",fontWeight:700,display:"inline-block",marginBottom:8}}>MEST POPULÆR</span>}
                  {inc.map(i => <div key={i} style={{fontSize:12,marginTop:4,display:"flex",gap:6}}><span style={{color:"var(--green)",fontWeight:700}}>✓</span>{i}</div>)}
                </div>
              ))}
            </>
          )}
          {profileTab==="anmeldelser" && (
            <>
              <div style={{display:"flex",gap:12,alignItems:"center",background:"var(--stone)",borderRadius:12,padding:"14px",marginBottom:14}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:40,color:"var(--bronze)"}}>{v.rating}</div>
                <div><div style={{fontSize:14,fontWeight:600}}>★★★★★</div><div style={{fontSize:12,color:"var(--muted)"}}>{v.reviews} anmeldelser</div></div>
              </div>
              {[["Lena & Mikkel","Juni 2024","★★★★★","Perfekte bilder! Profesjonelle og utrolig dyktige. Anbefaler til alle."],["Sara & Thomas","Mai 2024","★★★★★","Overgikk alle forventninger. Rask respons og veldig fleksible."],["Amalie & Jonas","April 2024","★★★★☆","Dyktige og hyggelige. Veldig fornøyde med resultatet."]].map(([name,date,rating,text]) => (
                <div key={name} style={{borderBottom:"1px solid var(--border)",padding:"12px 0"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontWeight:600,fontSize:13}}>{name}</span>
                    <span style={{fontSize:11,color:"var(--muted)"}}>{date}</span>
                  </div>
                  <div style={{fontSize:12,color:"var(--bronze)",marginBottom:4}}>{rating}</div>
                  <div style={{fontSize:13,color:"var(--text)",lineHeight:1.6}}>{text}</div>
                </div>
              ))}
            </>
          )}
          {profileTab==="notater" && (
            <>
              <div style={{marginBottom:12}}>
                <label className="label">Dine notater</label>
                <textarea className="inp" rows={4} style={{fontSize:13,lineHeight:1.6,resize:"vertical"}} value={myV?.notes||""} placeholder="Inntrykk fra møte, hva dere liker…"
                  onChange={e => { if(!myV) setStatus(v,"vurderes"); updateNote(v.id,"notes",e.target.value); }}/>
              </div>
              <div style={{marginBottom:12}}>
                <label className="label">{"Partnerens notater"}</label>
                <textarea className="inp" rows={3} style={{fontSize:13,lineHeight:1.6,resize:"vertical"}} value={myV?.partnerNote||""} placeholder={(wedding?.name2||"Partner")+" sine tanker…"}
                  onChange={e => { if(!myV) setStatus(v,"vurderes"); updateNote(v.id,"partnerNote",e.target.value); }}/>
              </div>
              <div style={{padding:"12px 14px",background:"var(--stone)",borderRadius:10}}>
                <div className="label" style={{marginBottom:8}}>Reaksjoner</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["❤️ Elsker","👍 Bra","🤔 Usikker","❌ Nei"].map(r => (
                    <button key={r} onClick={() => { if(!myV)setStatus(v,"vurderes"); updateNote(v.id,"reaction",r); showToast(r+" registrert"); }}
                      style={{padding:"6px 12px",borderRadius:20,border:"1.5px solid "+(myV?.reaction===r?"var(--bronze)":"var(--border)"),background:myV?.reaction===r?"var(--bronzeL)":"var(--white)",cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif"}}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {profileTab==="kobling" && (
            <>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,marginBottom:12}}>Kobling til planen</div>
              <div style={{background:"var(--white)",border:"1px solid var(--border)",borderRadius:12,padding:"14px",marginBottom:10}}>
                <div className="label" style={{marginBottom:8}}>Budsjett</div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:13}}>Estimert pris</span>
                  <span style={{fontSize:14,fontWeight:600,color:"var(--bronze)"}}>{myV?.price_estimate>0?fmtKr(myV.price_estimate):v.priceLabel}</span>
                </div>
                <button className="btn btn-outline btn-sm" style={{width:"100%"}} onClick={() => showToast("Legg til via Budsjett-fanen")}>
                  + Legg til som budsjettpost
                </button>
              </div>
              <div style={{background:"var(--white)",border:"1px solid var(--border)",borderRadius:12,padding:"14px"}}>
                <div className="label" style={{marginBottom:8}}>Bookingstatus</div>
                {["vurderes","kontaktet","valgt","booket"].map(s => {
                  const isAct = st===s;
                  const [col,bg] = STATUS_COLORS[s] || STATUS_COLORS.exploring;
                  return (
                    <button key={s} onClick={() => setStatus(v,s)}
                      style={{width:"100%",marginBottom:6,padding:"10px 14px",borderRadius:9,border:"1.5px solid "+(isAct?col:"var(--border)"),background:isAct?bg:"transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:"'Inter',sans-serif",textAlign:"left"}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:isAct?col:"var(--border)",flexShrink:0}}/>
                      <span style={{fontSize:13,fontWeight:600,color:isAct?col:"var(--text)"}}>{STATUS_LABELS[s]}</span>
                      {isAct && <span style={{marginLeft:"auto",fontSize:11,color:col,fontWeight:700}}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* CHAT */
  if (screen === "chat" && selVendor) {
    const msgs = chats[selVendor.id] || [];
    const QUICK = ["Hei! Vi er interessert i tjenestene deres.","Kan dere sende prisliste og tilgjengelighet?","Vi ønsker å booke dere. Send kontrakt?","Har dere tid til et møte?","Takk for tilbudet! Vi bekrefter bookingen."];
    return (
      <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
        <div style={{flexShrink:0,background:"var(--white)",borderBottom:"1px solid var(--border)",padding:"11px 14px",display:"flex",gap:10,alignItems:"center"}}>
          <BackBtn to="profile"/>
          <div style={{width:34,height:34,borderRadius:10,background:"var(--bronzeL)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"var(--bronze2)",flexShrink:0}}>
            {selVendor.name[0]}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selVendor.name}</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>{VENDOR_CATEGORIES_FULL.find(c=>c.id===selVendor.cat)?.label} · {selVendor.city}</div>
          </div>
        </div>
        <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"16px",background:"var(--stone)",display:"flex",flexDirection:"column",gap:8}}>
          {msgs.length === 0 && (
            <div style={{textAlign:"center",padding:"32px 16px"}}>
              <div style={{fontSize:32,marginBottom:8}}>💬</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,marginBottom:8}}>Start samtalen</div>
              <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:16}}>Meldingene lagres i appen.</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {QUICK.map(q => (
                  <button key={q} onClick={() => setChatMsg(q)} style={{padding:"9px 14px",borderRadius:10,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:12,textAlign:"left",fontFamily:"'Inter',sans-serif",color:"var(--text)"}}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {msgs.map(m => {
            const isMe = m.from==="planner";
            return (
              <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:isMe?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"80%",background:isMe?"#3A3028":"var(--white)",color:isMe?"white":"var(--text)",borderRadius:isMe?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"10px 14px",fontSize:14,lineHeight:1.6}}>
                  {m.text}
                </div>
                <div style={{fontSize:10,color:"var(--faint)",marginTop:3}}>{m.ts}</div>
              </div>
            );
          })}
        </div>
        {msgs.length > 0 && (
          <div style={{flexShrink:0,padding:"6px 12px 0",background:"var(--stone)",display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none"}}>
            {QUICK.slice(0,3).map(q => (
              <button key={q} onClick={() => setChatMsg(q)} style={{flexShrink:0,padding:"5px 12px",borderRadius:16,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:11,fontFamily:"'Inter',sans-serif",whiteSpace:"nowrap"}}>
                {q.length>28?q.slice(0,27)+"…":q}
              </button>
            ))}
          </div>
        )}
        <div style={{flexShrink:0,background:"var(--white)",borderTop:"1px solid var(--border)",padding:"10px 12px",display:"flex",gap:8,alignItems:"flex-end"}}>
          <textarea value={chatMsg} onChange={e=>setChatMsg(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}}
            placeholder={"Skriv til "+selVendor.name+"…"} rows={1}
            style={{flex:1,resize:"none",border:"1.5px solid var(--border)",borderRadius:12,padding:"10px 14px",fontSize:14,fontFamily:"'Inter',sans-serif",outline:"none",lineHeight:1.5,background:"var(--stone)",minHeight:42,maxHeight:120,overflow:"auto"}}/>
          <button onClick={sendChat} style={{width:42,height:42,borderRadius:12,border:"none",background:chatMsg.trim()?"#3A3028":"var(--border)",color:"white",cursor:chatMsg.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,transition:"background .15s"}}>↑</button>
        </div>
      </div>
    );
  }

  /* EDIT SHEET */
  if (editSheet && editDraft) {
    const d = editDraft;
    const isExisting = myVendors.find(v => v.id===d.id);
    const saveV = () => { if(!d.name.trim())return; if(isExisting)setMyVendors(p=>p.map(v=>v.id===d.id?d:v)); else setMyVendors(p=>[...p,{...d,status:d.status||"vurderes"}]); setEditSheet(false); showToast("Lagret"); };
    const delV  = () => { setMyVendors(p=>p.filter(v=>v.id!==d.id)); setEditSheet(false); showToast("Fjernet"); };
    return (
      <div className="fade-up">
        <div className="page-wrap">
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14,marginTop:8}}>
            <BackBtn to="home"/>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:500}}>{isExisting?"Rediger":"Ny leverandør"}</div>
          </div>
          <div className="inp-wrap"><label className="label">Navn</label><input className="inp" value={d.name} onChange={e=>setEditDraft(x=>({...x,name:e.target.value}))} placeholder="Firmanavn" autoFocus/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div><label className="label">Kategori</label>
              <select className="inp" value={d.cat} onChange={e=>setEditDraft(x=>({...x,cat:e.target.value}))}>
                {VENDOR_CATEGORIES_FULL.map(c=><option key={c.id} value={c.id}>{c.icon+" "+c.label}</option>)}
              </select>
            </div>
            <div><label className="label">Status</label>
              <select className="inp" value={d.status||"vurderes"} onChange={e=>setEditDraft(x=>({...x,status:e.target.value}))}>
                {Object.entries(STATUS_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="inp-wrap"><label className="label">Kontaktperson</label><input className="inp" value={d.contact_name||""} onChange={e=>setEditDraft(x=>({...x,contact_name:e.target.value}))} placeholder="Navn"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div><label className="label">E-post</label><input className="inp" type="email" value={d.email||""} onChange={e=>setEditDraft(x=>({...x,email:e.target.value}))} placeholder="e-post"/></div>
            <div><label className="label">Telefon</label><input className="inp" value={d.phone||""} onChange={e=>setEditDraft(x=>({...x,phone:e.target.value}))} placeholder="+47..."/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div><label className="label">Estimert (kr)</label><input className="inp" type="number" value={d.price_estimate||""} onChange={e=>setEditDraft(x=>({...x,price_estimate:Number(e.target.value)||0}))} placeholder="0"/></div>
            <div><label className="label">Faktisk (kr)</label><input className="inp" type="number" value={d.price_actual||""} onChange={e=>setEditDraft(x=>({...x,price_actual:Number(e.target.value)||0}))} placeholder="0"/></div>
          </div>
          <div className="inp-wrap"><label className="label">By</label><input className="inp" value={d.city||""} onChange={e=>setEditDraft(x=>({...x,city:e.target.value}))} placeholder="Oslo"/></div>
          <div className="inp-wrap"><label className="label">Nettside</label><input className="inp" value={d.website||""} onChange={e=>setEditDraft(x=>({...x,website:e.target.value}))} placeholder="https://..."/></div>
          <div className="inp-wrap"><label className="label">Notater</label><textarea className="inp" value={d.notes||""} onChange={e=>setEditDraft(x=>({...x,notes:e.target.value}))} placeholder="Inntrykk, møtenotater…"/></div>
          <button className="btn btn-primary btn-full mb8" onClick={saveV}>Lagre</button>
          {isExisting && <button className="btn btn-outline btn-full" style={{color:"var(--red)",borderColor:"var(--red)"}} onClick={delV}>Fjern</button>}
          <button className="btn btn-outline btn-full" style={{marginTop:8}} onClick={()=>setEditSheet(false)}>Avbryt</button>
        </div>
      </div>
    );
  }

  return null;
}

function Budget({ budget, setBudget, wedding, showToast }) {
  const [sheet, setSheet] = useState(false);
  const [draft, setDraft] = useState(null);

  const totalEst = budget.reduce((s,b)=>s+(b.estimated_cost||0),0);
  const totalAct = budget.reduce((s,b)=>s+(b.actual_cost||0),0);
  const budgetLimit = wedding.budget_total || 0;

  const openNew = () => {
    setDraft({id:Date.now(),category:"Diverse",name:"",estimated_cost:0,actual_cost:0,payment_status:"not_paid",notes:""});
    setSheet(true);
  };
  const openEdit = b => { setDraft({...b}); setSheet(true); };
  const save = () => {
    if (!draft.name.trim()) return;
    const item = {...draft, estimated_cost:Number(draft.estimated_cost)||0, actual_cost:Number(draft.actual_cost)||0};
    if (budget.find(b=>b.id===item.id)) {
      setBudget(prev=>prev.map(b=>b.id===item.id?item:b));
      showToast("Budsjettpost oppdatert");
    } else {
      setBudget(prev=>[...prev,item]);
      showToast("Budsjettpost lagt til");
    }
    setSheet(false);
  };
  const del = () => {
    setBudget(prev=>prev.filter(b=>b.id!==draft.id));
    setSheet(false);
    showToast("Budsjettpost slettet");
  };

  const payTag = s => {
    const m = {not_paid:["red","Ubetalt"],deposit_paid:["amber","Depositum"],partially_paid:["amber","Delvis betalt"],paid:["green","Betalt"],refunded:["muted","Refundert"]};
    const [t,l] = m[s]||["muted","—"];
    return <Tag type={t}>{l}</Tag>;
  };

  return (
    <div className="fade-up">
      <div className="page-wrap">
        <div className="page-header">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div><div className="page-kicker">Budsjett</div><div className="h1">{fmtKr(totalEst)}</div><div className="p-muted">Totalt estimert</div></div>
            <button className="btn btn-bronze btn-sm" onClick={openNew}>+ Post</button>
          </div>
        </div>

        {/* Summary */}
        <div className="insight-card" style={{background:"var(--text)"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0,borderBottom:"1px solid rgba(255,255,255,.07)",paddingBottom:16,marginBottom:16}}>
            {[{l:"Estimert",v:fmtKr(totalEst)},{l:"Faktisk brukt",v:fmtKr(totalAct)},{l:"Totalramme",v:budgetLimit?fmtKr(budgetLimit):"Ikke satt"}].map((s,i)=>(
              <div key={s.l} style={{textAlign:i===1?"center":i===2?"right":"left"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:500,color:i===2&&budgetLimit&&totalEst>budgetLimit?"#F87171":"white"}}>{s.v}</div>
                <div style={{fontSize:9,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(255,255,255,.3)",marginTop:3}}>{s.l}</div>
              </div>
            ))}
          </div>
          {budgetLimit > 0 && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:6}}>
                <span>Forbruk av totalramme</span>
                <span>{Math.round((totalEst/budgetLimit)*100)}%</span>
              </div>
              <div style={{height:4,background:"rgba(255,255,255,.1)",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min(100,(totalEst/budgetLimit)*100)}%`,background:totalEst>budgetLimit?"#F87171":"var(--bronze)",borderRadius:2,transition:"width .6s ease"}}/>
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        {budget.length === 0
          ? <EmptyState title="Ingen budsjettposter" sub="Legg til poster for å holde oversikt over utgifter og betalinger." cta="Legg til post" onCta={openNew}/>
          : (
            <div className="card-flush">
              <div style={{padding:"0 20px"}}>
                {budget.map(b=>{
                  const est=b.estimated_cost||0, act=b.actual_cost||0;
                  const over = act>0&&est>0&&act>est;
                  return (
                    <div key={b.id} className="budget-row" style={{cursor:"pointer"}} onClick={()=>openEdit(b)}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                        <div>
                          <div style={{fontSize:14,fontWeight:500,color:"var(--text)"}}>{b.name}</div>
                          <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{b.category}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                          <div style={{fontSize:14,fontWeight:600,color:over?"var(--red)":"var(--text)"}}>{fmtKr(act||est)}</div>
                          {act>0&&est>0&&act!==est&&<div style={{fontSize:10,color:"var(--muted)"}}>est. {fmtKr(est)}</div>}
                        </div>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        {payTag(b.payment_status)}
                        {over && <span style={{fontSize:10,color:"var(--red)",fontWeight:600}}>+{fmtKr(act-est)} over</span>}
                      </div>
                      {est>0 && totalEst>0 && <Prog pct={(est/totalEst)*100} h={3}/>}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        }
      </div>

      {sheet && draft && (
        <Sheet title={budget.find(b=>b.id===draft.id)?"Rediger post":"Ny budsjettpost"} onClose={()=>setSheet(false)}>
          <div className="inp-wrap"><label className="label">Navn</label><input className="inp" value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} placeholder="f.eks. Fotograf" autoFocus/></div>
          <div className="inp-wrap"><label className="label">Kategori</label>
            <select className="inp" value={draft.category} onChange={e=>setDraft(d=>({...d,category:e.target.value}))}>
              {BUDGET_CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div><label className="label">Estimert (kr)</label><input className="inp" type="number" value={draft.estimated_cost||""} onChange={e=>setDraft(d=>({...d,estimated_cost:e.target.value}))} placeholder="0"/></div>
            <div><label className="label">Faktisk (kr)</label><input className="inp" type="number" value={draft.actual_cost||""} onChange={e=>setDraft(d=>({...d,actual_cost:e.target.value}))} placeholder="0"/></div>
          </div>
          <div className="inp-wrap"><label className="label">Betalingsstatus</label>
            <select className="inp" value={draft.payment_status} onChange={e=>setDraft(d=>({...d,payment_status:e.target.value}))}>
              {Object.entries(BUDGET_PAYMENT_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="inp-wrap"><label className="label">Notater</label><textarea className="inp" value={draft.notes} onChange={e=>setDraft(d=>({...d,notes:e.target.value}))} placeholder="Detaljer, betalingsfrister..."/></div>
          <button className="btn btn-primary btn-full mb8" onClick={save}>Lagre</button>
          {budget.find(b=>b.id===draft.id) && <button className="btn btn-outline btn-full" style={{color:"var(--red)",borderColor:"var(--red)"}} onClick={del}>Slett post</button>}
        </Sheet>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SEATING — full venue floor plan
═══════════════════════════════════════════════════════════ */

/* Table shapes */
const TABLE_TYPES = [
  {id:"round",    label:"Rundt",         w:0,   h:0,   r:56,  cap:8,  icon:"⬤"},
  {id:"rect",     label:"Rektangel",     w:160, h:80,  r:8,   cap:8,  icon:"▬"},
  {id:"oval",     label:"Ovalt",         w:160, h:90,  r:45,  cap:10, icon:"⬭"},
  {id:"banquet",  label:"Langbord",      w:280, h:60,  r:6,   cap:16, icon:"═"},
  {id:"u",        label:"U-formet",      w:200, h:160, r:0,   cap:14, icon:"∪"},
  {id:"cocktail", label:"Cocktail",      w:0,   h:0,   r:30,  cap:4,  icon:"◦"},
];

/* Room elements */
const ROOM_ELEMENTS = [
  {type:"stage",       label:"Scene",          w:280, h:80,  color:"#2A2030", text:"white",  icon:"🎭"},
  {type:"dancefloor",  label:"Dansegulv",      w:200, h:200, color:"#F0EAF8", text:"#6A507A", icon:"◈", dashed:true},
  {type:"bar",         label:"Bar",            w:180, h:55,  color:"#2A1A10", text:"white",  icon:"◷"},
  {type:"buffet",      label:"Buffetbord",     w:220, h:55,  color:"#F5EFE8", text:"#4A3A2A", icon:"◉"},
  {type:"cake",        label:"Kakebord",       w:100, h:55,  color:"#FDF0F0", text:"#A06080", icon:"◎"},
  {type:"entrance",    label:"Inngang",        w:90,  h:20,  color:"#4A7C5C", text:"white",  icon:"▶"},
  {type:"exit",        label:"Nødutgang",      w:80,  h:20,  color:"#A83828", text:"white",  icon:"▶"},
  {type:"door",        label:"Dør",            w:60,  h:16,  color:"#8A7060", text:"white",  icon:"▮"},
  {type:"toilet",      label:"Toalett",        w:80,  h:80,  color:"#E8EEF4", text:"#4A6080", icon:"WC"},
  {type:"photobooth",  label:"Fotoboks",       w:100, h:100, color:"#F0EAD0", text:"#8A7030", icon:"◫"},
  {type:"gifts",       label:"Gavebordet",     w:140, h:55,  color:"#F5EDF8", text:"#806090", icon:"◇"},
  {type:"seremony",    label:"Seremonirom",    w:240, h:100, color:"#F0F0E8", text:"#5A5A40", icon:"✦"},
  {type:"plant",       label:"Plante / dekor", w:60,  h:60,  color:"#D8ECD8", text:"#4A7050", icon:"✿"},
  {type:"pillar",      label:"Søyle",          w:40,  h:40,  color:"#D8D4CC", text:"#6A6460", icon:"●"},
  {type:"wall",        label:"Vegg / skillevegg", w:200, h:16, color:"#B8B0A8", text:"white",  icon:"▬"},
];

const GUEST_COLORS = ["#E8C4B8","#C8D8C8","#C8D0E8","#E8D8C0","#D8C8E8","#C8E0D8","#D0E0C8","#C8D0D8"];
const gc = id => GUEST_COLORS[Math.abs(id)%8];

function spInits(name) {
  if (!name) return "?";
  const p = name.trim().split(/\s+/);
  return p.length >= 2 ? p[0][0]+p[p.length-1][0] : p[0].slice(0,2);
}

/* Draw a table shape on a canvas 2d context */
function drawTableShape(ctx, t, sel, scale) {
  const type = TABLE_TYPES.find(x=>x.id===t.shape)||TABLE_TYPES[0];
  const {x,y,w,h,r,color="#FFF8F0",border="#B8956A",rotation=0} = t;
  const bColor = sel ? "#B8956A" : border;
  const lw = sel ? 2.5 : 1.5;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.strokeStyle = bColor;
  ctx.lineWidth   = lw / scale;
  ctx.fillStyle   = color;

  if (t.shape==="round"||t.shape==="cocktail") {
    const rad = type.r;
    ctx.beginPath(); ctx.arc(0,0,rad,0,Math.PI*2); ctx.fill(); ctx.stroke();
  } else if (t.shape==="oval") {
    ctx.beginPath(); ctx.ellipse(0,0,w/2,h/2,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
  } else if (t.shape==="u") {
    const wh=w/2, hh=h/2, wall=18;
    ctx.beginPath();
    ctx.moveTo(-wh,-hh); ctx.lineTo(wh,-hh); ctx.lineTo(wh,hh);
    ctx.lineTo(wh-wall,hh); ctx.lineTo(wh-wall,-hh+wall);
    ctx.lineTo(-wh+wall,-hh+wall); ctx.lineTo(-wh+wall,hh);
    ctx.lineTo(-wh,hh); ctx.closePath(); ctx.fill(); ctx.stroke();
  } else {
    const rr = Math.min(r, Math.min(w,h)/2);
    const x0=-w/2, y0=-h/2;
    ctx.beginPath();
    ctx.moveTo(x0+rr,y0);
    ctx.lineTo(x0+w-rr,y0); ctx.arcTo(x0+w,y0,x0+w,y0+rr,rr);
    ctx.lineTo(x0+w,y0+h-rr); ctx.arcTo(x0+w,y0+h,x0+w-rr,y0+h,rr);
    ctx.lineTo(x0+rr,y0+h); ctx.arcTo(x0,y0+h,x0,y0+h-rr,rr);
    ctx.lineTo(x0,y0+rr); ctx.arcTo(x0,y0,x0+rr,y0,rr);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

function Seating({ guests, showToast }) {
  const canvasRef = useRef(null);
  const wrapRef   = useRef(null);
  const pinchRef  = useRef(null);

  const [pan,    setPan]    = useState({x:40,y:40});
  const [scale,  setScale]  = useState(0.85);
  const [sel,    setSel]    = useState(null);   // selected id + type ("table"|"element")
  const [drag,   setDrag]   = useState(null);
  const [panning,setPanning]= useState(false);
  const [panStart,setPanStart]=useState(null);
  const [panel,  setPanel]  = useState(null);   // "addTable"|"addElement"|"editTable"|"assign"
  const [assignSearch, setAssignSearch] = useState("");
  const [rotDrag, setRotDrag] = useState(null); // {id, type, startAngle, initRotation}

  const [tables, setTables] = useState([
    {id:1, shape:"round",   x:200, y:200, name:"Brudeparets bord", capacity:8,  color:"#F5EDD8", border:"#B8956A", rotation:0},
    {id:2, shape:"round",   x:400, y:200, name:"Familiens bord",   capacity:8,  color:"#EAF0EA", border:"#6A8A6A", rotation:0},
    {id:3, shape:"round",   x:600, y:200, name:"Bord 3",           capacity:8,  color:"#EAE8F0", border:"#7A6A8A", rotation:0},
    {id:4, shape:"rect",    x:200, y:400, name:"Langbord A",        capacity:10, color:"#F5EDD8", border:"#B8956A", rotation:0},
    {id:5, shape:"rect",    x:480, y:400, name:"Langbord B",        capacity:10, color:"#EAF0EA", border:"#6A8A6A", rotation:0},
  ]);
  const [elements, setElements] = useState([
    {id:101, type:"stage",      x:420, y:80,  w:280, h:80,  label:"Scene",    color:"#2A2030", text:"white",    rotation:0},
    {id:102, type:"entrance",   x:420, y:560, w:90,  h:20,  label:"Inngang",  color:"#4A7C5C", text:"white",    rotation:0},
    {id:103, type:"bar",        x:720, y:200, w:180, h:55,  label:"Bar",      color:"#2A1A10", text:"white",    rotation:0},
    {id:104, type:"dancefloor", x:420, y:300, w:160, h:120, label:"Dansegulv",color:"#F0EAF8", text:"#6A507A", dashed:true, rotation:0},
  ]);
  const [assign, setAssign] = useState({});

  const selTable   = sel?.type==="table"   ? tables.find(t=>t.id===sel.id)   : null;
  const selElement = sel?.type==="element" ? elements.find(e=>e.id===sel.id) : null;
  const allSeated  = Object.values(assign).flat();
  const unassigned = guests.filter(g=>!allSeated.includes(g.id));
  const selSeated  = selTable ? (assign[selTable.id]||[]).map(id=>guests.find(g=>g.id===id)).filter(Boolean) : [];

  // ── HIT TEST — returns {type, id, handle:"rotate"?} ──
  const hitTest = useCallback((cx,cy) => {
    // Check rotation handles first (only for selected objects)
    if (sel) {
      const obj = sel.type==="table" ? tables.find(t=>t.id===sel.id) : elements.find(e=>e.id===sel.id);
      if (obj) {
        const rot = obj.rotation||0;
        let handleDist;
        if (sel.type==="table") {
          const type = TABLE_TYPES.find(x=>x.id===obj.shape)||TABLE_TYPES[0];
          const tObj = {...obj, w:obj.w||type.w, h:obj.h||type.h};
          if (obj.shape==="round"||obj.shape==="cocktail") handleDist = -1; // no handle for round
          else handleDist = Math.max(tObj.w||0,tObj.h||0)/2 + 28;
        } else {
          const def = ROOM_ELEMENTS.find(r=>r.type===obj.type);
          handleDist = Math.max(obj.w||def?.w||80, obj.h||def?.h||60)/2 + 28;
        }
        if (handleDist > 0) {
          const hx = obj.x + Math.sin(rot)*-handleDist;
          const hy = obj.y + Math.cos(rot)*-handleDist;
          if (Math.hypot(cx-hx, cy-hy) <= 12) return {type:sel.type, id:sel.id, handle:"rotate"};
        }
      }
    }
    // Check tables
    for (let i=tables.length-1; i>=0; i--) {
      const t = tables[i];
      const type = TABLE_TYPES.find(x=>x.id===t.shape)||TABLE_TYPES[0];
      const hw = t.shape==="round"||t.shape==="cocktail" ? type.r : (t.w||type.w)/2;
      const hh = t.shape==="round"||t.shape==="cocktail" ? type.r : (t.h||type.h)/2;
      // Rotate click point into object's local space
      const rot = t.rotation||0;
      const dx = cx-t.x, dy = cy-t.y;
      const lx = dx*Math.cos(-rot)-dy*Math.sin(-rot);
      const ly = dx*Math.sin(-rot)+dy*Math.cos(-rot);
      if (Math.abs(lx)<=hw+12 && Math.abs(ly)<=hh+12) return {type:"table",id:t.id};
    }
    // Check elements
    for (let i=elements.length-1; i>=0; i--) {
      const e = elements[i];
      const def = ROOM_ELEMENTS.find(r=>r.type===e.type);
      const rot = e.rotation||0;
      const ew=(e.w||def?.w||80)/2+8, eh=(e.h||def?.h||60)/2+8;
      const dx=cx-e.x, dy=cy-e.y;
      const lx=dx*Math.cos(-rot)-dy*Math.sin(-rot);
      const ly=dx*Math.sin(-rot)+dy*Math.cos(-rot);
      if (Math.abs(lx)<=ew && Math.abs(ly)<=eh) return {type:"element",id:e.id};
    }
    return null;
  },[tables,elements,sel]);

  // ── CANVAS RENDER ──
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas||!wrap) return;

    canvas.width  = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Background grid
    ctx.save();
    ctx.strokeStyle = "rgba(184,149,106,.12)";
    ctx.lineWidth   = 1;
    const gs = 32*scale;
    const ox = ((pan.x%gs)+gs)%gs;
    const oy = ((pan.y%gs)+gs)%gs;
    for (let x=ox; x<canvas.width; x+=gs) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
    for (let y=oy; y<canvas.height; y+=gs) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
    ctx.restore();

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);

    // ── Draw elements ──
    elements.forEach(el => {
      const def   = ROOM_ELEMENTS.find(r=>r.type===el.type);
      const ew    = el.w || def?.w || 80;
      const eh    = el.h || def?.h || 60;
      const rot   = el.rotation || 0;
      const isSel = sel?.type==="element"&&sel?.id===el.id;

      ctx.save();
      ctx.translate(el.x, el.y);
      ctx.rotate(rot);
      ctx.fillStyle   = el.color || def?.color || "#E8E4DE";
      ctx.strokeStyle = isSel ? "#B8956A" : "rgba(0,0,0,.15)";
      ctx.lineWidth   = (isSel?2.5:1)/scale;
      if (el.dashed||def?.dashed) ctx.setLineDash([6/scale,4/scale]);

      const rr=6/scale, x0=-ew/2, y0=-eh/2;
      ctx.beginPath();
      ctx.moveTo(x0+rr,y0);
      ctx.lineTo(x0+ew-rr,y0); ctx.arcTo(x0+ew,y0,x0+ew,y0+rr,rr);
      ctx.lineTo(x0+ew,y0+eh-rr); ctx.arcTo(x0+ew,y0+eh,x0+ew-rr,y0+eh,rr);
      ctx.lineTo(x0+rr,y0+eh); ctx.arcTo(x0,y0+eh,x0,y0+eh-rr,rr);
      ctx.lineTo(x0,y0+rr); ctx.arcTo(x0,y0,x0+rr,y0,rr);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = el.text || def?.text || "#3A3028";
      ctx.font = `600 ${Math.max(9,11/scale)}px Inter,sans-serif`;
      ctx.textAlign="center"; ctx.textBaseline="middle";
      const lbl = el.label || def?.label || "";
      ctx.fillText(lbl.length>14 ? lbl.slice(0,13)+"…" : lbl, 0, 0);
      ctx.restore();

      // Rotation handle (shown when selected)
      if (isSel) {
        const handleDist = Math.max(ew,eh)/2 + 28/scale;
        const hx = el.x + Math.sin(rot)*-handleDist;
        const hy = el.y + Math.cos(rot)*-handleDist;
        // Stem line
        ctx.save();
        ctx.strokeStyle = "rgba(184,149,106,.6)";
        ctx.lineWidth = 1.5/scale;
        ctx.setLineDash([4/scale,3/scale]);
        ctx.beginPath(); ctx.moveTo(el.x,el.y); ctx.lineTo(hx,hy); ctx.stroke();
        ctx.setLineDash([]);
        // Handle circle
        ctx.fillStyle = "#B8956A";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.5/scale;
        ctx.beginPath(); ctx.arc(hx,hy,8/scale,0,Math.PI*2); ctx.fill(); ctx.stroke();
        // Arrow icon
        ctx.fillStyle = "white";
        ctx.font = `bold ${Math.max(6,9/scale)}px Inter,sans-serif`;
        ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText("↻", hx, hy);
        ctx.restore();
      }
    });

    // ── Draw tables ──
    tables.forEach(t => {
      const type   = TABLE_TYPES.find(x=>x.id===t.shape)||TABLE_TYPES[0];
      const isSel  = sel?.type==="table"&&sel?.id===t.id;
      const seated = (assign[t.id]||[]).map(id=>guests.find(g=>g.id===id)).filter(Boolean);
      const cap    = t.capacity||type.cap;
      const rot    = t.rotation||0;

      // Draw shape (already rotates internally)
      const tObj = { ...t, w:t.w||type.w, h:t.h||type.h, r:type.r };
      drawTableShape(ctx, tObj, isSel, scale);

      // Table label (drawn unrotated, always readable)
      ctx.save();
      ctx.fillStyle = "#3A3028";
      ctx.font = `600 ${Math.max(8,10/scale)}px Inter,sans-serif`;
      ctx.textAlign="center"; ctx.textBaseline="middle";
      const short = t.name.length>12 ? t.name.slice(0,11)+"…" : t.name;
      ctx.fillText(short, t.x, t.y-5/scale);
      ctx.fillStyle="#8A8078";
      ctx.font=`${Math.max(7,9/scale)}px Inter,sans-serif`;
      ctx.fillText(`${seated.length}/${cap}`,t.x,t.y+8/scale);
      ctx.restore();

      // ── Seat dots — shape-aware positioning ──
      const sr  = 10/scale;
      const pad = 18; // distance outside table edge

      // Build array of local (pre-rotation) seat positions based on shape
      const getSeatPositions = (shape, w, h, r, capacity) => {
        const positions = [];
        const n = capacity;

        if (shape==="round"||shape==="cocktail") {
          // Circle: evenly spaced around circumference
          for (let i=0;i<n;i++) {
            const a = (i/n)*Math.PI*2 - Math.PI/2;
            positions.push({lx:Math.cos(a)*(r+pad), ly:Math.sin(a)*(r+pad)});
          }

        } else if (shape==="oval") {
          // Ellipse: seats on ellipse perimeter
          const rx = w/2+pad, ry = h/2+pad;
          for (let i=0;i<n;i++) {
            const a = (i/n)*Math.PI*2 - Math.PI/2;
            positions.push({lx:Math.cos(a)*rx, ly:Math.sin(a)*ry});
          }

        } else if (shape==="rect"||shape==="banquet") {
          // Rectangle: seats along all 4 sides, distributed by perimeter
          const hw=w/2, hh=h/2;
          const perim = 2*(w+h);
          const spacing = perim/n;
          // Start from top-left corner, go clockwise
          for (let i=0;i<n;i++) {
            let d = i*spacing;
            let lx, ly;
            if (d < w) {                       // top side →
              lx = -hw + d;   ly = -(hh+pad);
            } else if (d < w+h) {              // right side ↓
              d -= w;
              lx = hw+pad;    ly = -hh + d;
            } else if (d < 2*w+h) {            // bottom side ←
              d -= w+h;
              lx = hw - d;    ly = hh+pad;
            } else {                           // left side ↑
              d -= 2*w+h;
              lx = -(hw+pad); ly = hh - d;
            }
            positions.push({lx, ly});
          }

        } else if (shape==="u") {
          // U-shape: seats along outer U perimeter and inside top
          const hw=w/2, hh=h/2, wall=18;
          // Outer: left side up, across top, right side down
          // Inner: across the opening (top of the U hollow)
          const outerPerim = h + w + h;              // left + top + right
          const innerPerim = w - 2*wall;              // inner top bar
          const total = outerPerim + innerPerim;
          const spacing = total / n;
          for (let i=0;i<n;i++) {
            let d = i*spacing;
            let lx, ly;
            if (d < h) {                             // left outer ↑
              lx = -(hw+pad); ly = hh - d;
            } else if (d < h+w) {                    // top outer →
              d -= h;
              lx = -hw + d;   ly = -(hh+pad);
            } else if (d < h+w+h) {                  // right outer ↓
              d -= h+w;
              lx = hw+pad;    ly = -hh + d;
            } else {                                  // inner top →
              d -= h+w+h;
              lx = -hw+wall + d; ly = -hh+wall+pad;
            }
            positions.push({lx, ly});
          }

        } else {
          // Fallback: circle
          for (let i=0;i<n;i++) {
            const a=(i/n)*Math.PI*2-Math.PI/2;
            positions.push({lx:Math.cos(a)*(r+pad), ly:Math.sin(a)*(r+pad)});
          }
        }
        return positions;
      };

      const type2  = TABLE_TYPES.find(x=>x.id===t.shape)||TABLE_TYPES[0];
      const allPositions = getSeatPositions(t.shape, tObj.w, tObj.h, type2.r, cap);

      seated.forEach((g, i) => {
        if (i >= allPositions.length) return;
        const {lx, ly} = allPositions[i];
        // Rotate local position by table rotation
        const sx = t.x + lx*Math.cos(rot) - ly*Math.sin(rot);
        const sy = t.y + lx*Math.sin(rot) + ly*Math.cos(rot);

        ctx.save();
        ctx.fillStyle   = gc(g.id);
        ctx.strokeStyle = g.allergies ? "#C4803A" : "white";
        ctx.lineWidth   = 1.5/scale;
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#3A3028";
        ctx.font = `bold ${Math.max(6,8/scale)}px Inter,sans-serif`;
        ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(spInits(`${g.first_name} ${g.last_name}`)[0], sx, sy);
        ctx.restore();
      });

      // Rotation handle for selected non-round tables
      if (isSel && t.shape!=="round" && t.shape!=="cocktail") {
        const handleDist = Math.max(tObj.w||0, tObj.h||0)/2 + 28/scale;
        const hx = t.x + Math.sin(rot)*-handleDist;
        const hy = t.y + Math.cos(rot)*-handleDist;
        ctx.save();
        ctx.strokeStyle="rgba(184,149,106,.6)"; ctx.lineWidth=1.5/scale;
        ctx.setLineDash([4/scale,3/scale]);
        ctx.beginPath(); ctx.moveTo(t.x,t.y); ctx.lineTo(hx,hy); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle="#B8956A"; ctx.strokeStyle="white"; ctx.lineWidth=1.5/scale;
        ctx.beginPath(); ctx.arc(hx,hy,8/scale,0,Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle="white";
        ctx.font=`bold ${Math.max(6,9/scale)}px Inter,sans-serif`;
        ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText("↻",hx,hy);
        ctx.restore();
      }
    });

    ctx.restore();
  }, [tables, elements, assign, guests, pan, scale, sel]);

  // ── POINTER EVENTS ──
  const worldPos = useCallback((e) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return {x:0,y:0};
    return {x:(e.clientX-r.left-pan.x)/scale, y:(e.clientY-r.top-pan.y)/scale};
  },[pan,scale]);

  const onPointerDown = useCallback((e) => {
    if (e.button!==undefined&&e.button!==0) return;
    const wp = worldPos(e);
    const hit = hitTest(wp.x, wp.y);
    if (hit) {
      setSel({type:hit.type,id:hit.id});
      setPanel(null);
      if (hit.handle==="rotate") {
        // Start rotation drag
        const obj = hit.type==="table" ? tables.find(t=>t.id===hit.id) : elements.find(el=>el.id===hit.id);
        const startAngle = Math.atan2(wp.x-obj.x, -(wp.y-obj.y));
        setRotDrag({id:hit.id, type:hit.type, startAngle, initRotation:obj.rotation||0});
        canvasRef.current?.setPointerCapture(e.pointerId);
      } else {
        const obj = hit.type==="table" ? tables.find(t=>t.id===hit.id) : elements.find(el=>el.id===hit.id);
        setDrag({id:hit.id, type:hit.type, ox:obj.x, oy:obj.y, px:e.clientX, py:e.clientY});
        canvasRef.current?.setPointerCapture(e.pointerId);
      }
    } else {
      setSel(null);
      setPanel(null);
      setPanning(true);
      setPanStart({px:e.clientX-pan.x, py:e.clientY-pan.y});
    }
  },[worldPos,hitTest,tables,elements,pan]);

  const onPointerMove = useCallback((e) => {
    if (rotDrag) {
      const wp = worldPos(e);
      const obj = rotDrag.type==="table" ? tables.find(t=>t.id===rotDrag.id) : elements.find(el=>el.id===rotDrag.id);
      if (!obj) return;
      const curAngle = Math.atan2(wp.x-obj.x, -(wp.y-obj.y));
      const delta = curAngle - rotDrag.startAngle;
      const newRot = rotDrag.initRotation + delta;
      if (rotDrag.type==="table") setTables(prev=>prev.map(t=>t.id===rotDrag.id?{...t,rotation:newRot}:t));
      else setElements(prev=>prev.map(el=>el.id===rotDrag.id?{...el,rotation:newRot}:el));
    } else if (drag) {
      const dx=(e.clientX-drag.px)/scale, dy=(e.clientY-drag.py)/scale;
      if (drag.type==="table") setTables(prev=>prev.map(t=>t.id===drag.id?{...t,x:drag.ox+dx,y:drag.oy+dy}:t));
      else setElements(prev=>prev.map(el=>el.id===drag.id?{...el,x:drag.ox+dx,y:drag.oy+dy}:el));
    } else if (panning&&panStart) {
      setPan({x:e.clientX-panStart.px, y:e.clientY-panStart.py});
    }
  },[rotDrag,drag,panning,panStart,scale,worldPos,tables,elements]);

  const onPointerUp = useCallback(()=>{ setDrag(null); setRotDrag(null); setPanning(false); setPanStart(null); },[]);

  // Pinch zoom
  const onTouchStart = useCallback(e=>{
    if(e.touches.length===2) pinchRef.current=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
  },[]);
  const onTouchMove = useCallback(e=>{
    if(e.touches.length===2&&pinchRef.current){
      e.preventDefault();
      const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      const mx=(e.touches[0].clientX+e.touches[1].clientX)/2, my=(e.touches[0].clientY+e.touches[1].clientY)/2;
      const r=canvasRef.current?.getBoundingClientRect();
      if(r){
        const cx=mx-r.left, cy=my-r.top;
        const factor=d/pinchRef.current;
        setScale(s=>{const ns=Math.min(3,Math.max(.2,s*factor)); setPan(p=>({x:cx-(cx-p.x)*(ns/s),y:cy-(cy-p.y)*(ns/s)})); return ns; });
      }
      pinchRef.current=d;
    }
  },[]);

  // Wheel zoom
  useEffect(()=>{
    const el=canvasRef.current; if(!el)return;
    const fn=e=>{ e.preventDefault();
      const r=el.getBoundingClientRect(), cx=e.clientX-r.left, cy=e.clientY-r.top;
      setScale(s=>{ const ns=Math.min(3,Math.max(.2,s*(1-e.deltaY*.001))); setPan(p=>({x:cx-(cx-p.x)*(ns/s),y:cy-(cy-p.y)*(ns/s)})); return ns; });
    };
    el.addEventListener("wheel",fn,{passive:false}); return()=>el.removeEventListener("wheel",fn);
  },[]);

  const fitAll = useCallback(()=>{
    const wrap=wrapRef.current; if(!wrap||(!tables.length&&!elements.length))return;
    const all=[...tables,...elements];
    const xs=all.map(o=>o.x), ys=all.map(o=>o.y);
    const x0=Math.min(...xs)-100, y0=Math.min(...ys)-100, x1=Math.max(...xs)+100, y1=Math.max(...ys)+100;
    const fw=wrap.clientWidth-40, fh=wrap.clientHeight-40;
    const ns=Math.min(3,Math.max(.2,Math.min(fw/(x1-x0),fh/(y1-y0))));
    setScale(ns); setPan({x:20-x0*ns, y:20-y0*ns});
  },[tables,elements]);

  const addTable = (shape) => {
    const type = TABLE_TYPES.find(x=>x.id===shape)||TABLE_TYPES[0];
    const n = tables.length+1;
    const newT = {id:Date.now(), shape, x:300+Math.random()*100, y:300+Math.random()*100, name:`Bord ${n}`, capacity:type.cap, color:"#F5EDD8", border:"#B8956A", w:type.w, h:type.h, rotation:0};
    setTables(prev=>[...prev,newT]);
    setSel({type:"table",id:newT.id});
    setPanel("editTable");
  };

  const addElement = (elType) => {
    const def = ROOM_ELEMENTS.find(r=>r.type===elType);
    const newEl = {id:Date.now(), type:elType, x:400+Math.random()*80, y:300+Math.random()*80, w:def.w, h:def.h, label:def.label, color:def.color, text:def.text, dashed:def.dashed||false, rotation:0};
    setElements(prev=>[...prev,newEl]);
    setSel({type:"element",id:newEl.id});
    setPanel(null);
  };

  const deleteSelected = () => {
    if (sel?.type==="table") { setTables(prev=>prev.filter(t=>t.id!==sel.id)); setAssign(a=>{const n={...a};delete n[sel.id];return n;}); }
    else if (sel?.type==="element") setElements(prev=>prev.filter(e=>e.id!==sel.id));
    setSel(null); setPanel(null);
  };

  const updateSelTable = (changes) => setTables(prev=>prev.map(t=>t.id===sel.id?{...t,...changes}:t));

  // ── PANEL CONTENT ──
  const PanelAddTable = () => (
    <div style={{padding:"12px 14px"}}>
      <div style={{fontSize:10,letterSpacing:".16em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,marginBottom:10}}>Velg bordform</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {TABLE_TYPES.map(t=>(
          <button key={t.id} onClick={()=>{addTable(t.id);setPanel(null);}}
            style={{padding:"12px 8px",border:"1.5px solid var(--border)",borderRadius:10,background:"var(--white)",cursor:"pointer",textAlign:"center",fontFamily:"'Inter',sans-serif"}}>
            <div style={{fontSize:22,marginBottom:4,color:"var(--bronze)"}}>{t.icon}</div>
            <div style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{t.label}</div>
            <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{t.cap} pers.</div>
          </button>
        ))}
      </div>
    </div>
  );

  const PanelAddElement = () => (
    <div style={{padding:"12px 14px"}}>
      <div style={{fontSize:10,letterSpacing:".16em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,marginBottom:10}}>Legg til element</div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {ROOM_ELEMENTS.map(el=>(
          <button key={el.type} onClick={()=>{addElement(el.type);setPanel(null);}}
            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",border:"1.5px solid var(--border)",borderRadius:9,background:"var(--white)",cursor:"pointer",textAlign:"left",fontFamily:"'Inter',sans-serif"}}>
            <div style={{width:28,height:28,borderRadius:6,background:el.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:el.text,fontWeight:700,flexShrink:0}}>{el.icon}</div>
            <div style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>{el.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const PanelEditTable = () => {
    const t = selTable; if (!t) return null;
    const type = TABLE_TYPES.find(x=>x.id===t.shape)||TABLE_TYPES[0];
    const seated = (assign[t.id]||[]).map(id=>guests.find(g=>g.id===id)).filter(Boolean);
    const filteredUnassigned = unassigned.filter(g=>
      !assignSearch || `${g.first_name} ${g.last_name}`.toLowerCase().includes(assignSearch.toLowerCase())
    );
    return (
      <div style={{padding:"12px 14px"}}>
        <div style={{fontSize:10,letterSpacing:".16em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,marginBottom:10}}>Rediger bord</div>
        <div style={{marginBottom:10}}>
          <label style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,display:"block",marginBottom:4}}>Navn</label>
          <input className="inp" value={t.name} onChange={e=>updateSelTable({name:e.target.value})} style={{fontSize:13,minHeight:36,padding:"8px 10px"}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <div>
            <label style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,display:"block",marginBottom:4}}>Form</label>
            <select className="inp" value={t.shape} onChange={e=>updateSelTable({shape:e.target.value,w:TABLE_TYPES.find(x=>x.id===e.target.value)?.w,h:TABLE_TYPES.find(x=>x.id===e.target.value)?.h})} style={{fontSize:12,minHeight:36,padding:"6px 10px"}}>
              {TABLE_TYPES.map(tt=><option key={tt.id} value={tt.id}>{tt.icon} {tt.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,display:"block",marginBottom:4}}>Plasser</label>
            <input className="inp" type="number" value={t.capacity} min={1} max={40} onChange={e=>updateSelTable({capacity:Number(e.target.value)||1})} style={{fontSize:13,minHeight:36,padding:"8px 10px"}}/>
          </div>
        </div>

        {/* Rotation */}
        {t.shape!=="round"&&t.shape!=="cocktail"&&(
          <div style={{marginBottom:10}}>
            <label style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,display:"block",marginBottom:6}}>Rotasjon — {Math.round((t.rotation||0)*180/Math.PI)}°</label>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <button onClick={()=>updateSelTable({rotation:((t.rotation||0)-Math.PI/12+Math.PI*2)%(Math.PI*2)})} style={{flex:1,padding:"8px",borderRadius:8,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:16,fontFamily:"'Inter',sans-serif"}}>↺ −15°</button>
              <button onClick={()=>updateSelTable({rotation:0})} style={{padding:"8px 10px",borderRadius:8,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:11,fontFamily:"'Inter',sans-serif",color:"var(--muted)"}}>0°</button>
              <button onClick={()=>updateSelTable({rotation:((t.rotation||0)+Math.PI/12)%(Math.PI*2)})} style={{flex:1,padding:"8px",borderRadius:8,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:16,fontFamily:"'Inter',sans-serif"}}>↻ +15°</button>
            </div>
            <input type="range" min={0} max={360} value={Math.round((t.rotation||0)*180/Math.PI)} onChange={e=>updateSelTable({rotation:Number(e.target.value)*Math.PI/180})} style={{width:"100%",marginTop:6,accentColor:"var(--bronze)"}}/>
          </div>
        )}

        {/* Seated guests */}
        <div style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,marginBottom:6}}>
          Plassert ({seated.length}/{t.capacity})
        </div>
        <div style={{marginBottom:10,minHeight:20}}>
          {seated.length===0 && <div style={{fontSize:12,color:"var(--faint)",padding:"6px 0"}}>Ingen plassert ennå</div>}
          {seated.map(g=>(
            <div key={g.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid var(--border)"}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:gc(g.id),display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0,color:"#3A3028"}}>{spInits(`${g.first_name} ${g.last_name}`)}</div>
              <div style={{flex:1,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.first_name} {g.last_name}</div>
              {g.allergies&&<div style={{fontSize:9,color:"var(--amber)",fontWeight:700}}>Allergi</div>}
              <button onClick={()=>setAssign(a=>({...a,[t.id]:(a[t.id]||[]).filter(id=>id!==g.id)}))}
                style={{background:"none",border:"none",cursor:"pointer",color:"var(--faint)",fontSize:14,padding:"2px 4px",flexShrink:0}}>×</button>
            </div>
          ))}
        </div>

        {/* Unassigned guests to add */}
        {seated.length < t.capacity && (
          <>
            <div style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,marginBottom:6}}>Legg til gjest</div>
            <input className="inp" placeholder="Søk…" value={assignSearch} onChange={e=>setAssignSearch(e.target.value)} style={{fontSize:12,minHeight:32,padding:"6px 10px",marginBottom:6}}/>
            <div style={{maxHeight:140,overflowY:"auto"}}>
              {filteredUnassigned.slice(0,20).map(g=>(
                <div key={g.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid var(--border)",cursor:"pointer"}}
                  onClick={()=>setAssign(a=>({...a,[t.id]:[...(a[t.id]||[]),g.id]}))}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:gc(g.id),display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0}}>{spInits(`${g.first_name} ${g.last_name}`)}</div>
                  <div style={{flex:1,fontSize:12}}>{g.first_name} {g.last_name}</div>
                  {g.allergies&&<div style={{fontSize:9,color:"var(--amber)",fontWeight:700}}>A</div>}
                  <span style={{color:"var(--bronze)",fontSize:14,fontWeight:700}}>+</span>
                </div>
              ))}
              {filteredUnassigned.length===0&&<div style={{fontSize:12,color:"var(--faint)",padding:"8px 0"}}>Ingen ledige gjester</div>}
            </div>
          </>
        )}

        <button onClick={deleteSelected} style={{width:"100%",marginTop:12,padding:"9px",borderRadius:9,border:"1.5px solid var(--redL)",background:"transparent",color:"var(--red)",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>Slett bord</button>
      </div>
    );
  };

  const PanelEditElement = () => {
    const el = selElement; if (!el) return null;
    const def = ROOM_ELEMENTS.find(r=>r.type===el.type);
    return (
      <div style={{padding:"12px 14px"}}>
        <div style={{fontSize:10,letterSpacing:".16em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,marginBottom:10}}>Rediger element</div>
        <div style={{marginBottom:10}}>
          <label style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,display:"block",marginBottom:4}}>Navn</label>
          <input className="inp" value={el.label||def?.label||""} onChange={e=>setElements(prev=>prev.map(x=>x.id===el.id?{...x,label:e.target.value}:x))} style={{fontSize:13,minHeight:36,padding:"8px 10px"}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          <div>
            <label style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,display:"block",marginBottom:4}}>Bredde</label>
            <input className="inp" type="number" value={el.w} onChange={e=>setElements(prev=>prev.map(x=>x.id===el.id?{...x,w:Number(e.target.value)||40}:x))} style={{fontSize:13,minHeight:36,padding:"8px 10px"}}/>
          </div>
          <div>
            <label style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,display:"block",marginBottom:4}}>Høyde</label>
            <input className="inp" type="number" value={el.h} onChange={e=>setElements(prev=>prev.map(x=>x.id===el.id?{...x,h:Number(e.target.value)||40}:x))} style={{fontSize:13,minHeight:36,padding:"8px 10px"}}/>
          </div>
        </div>

        {/* Rotation */}
        <div style={{marginBottom:10}}>
          <label style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,display:"block",marginBottom:6}}>Rotasjon — {Math.round((el.rotation||0)*180/Math.PI)}°</label>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <button onClick={()=>setElements(prev=>prev.map(x=>x.id===el.id?{...x,rotation:((x.rotation||0)-Math.PI/12+Math.PI*2)%(Math.PI*2)}:x))} style={{flex:1,padding:"8px",borderRadius:8,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:16}}>↺ −15°</button>
            <button onClick={()=>setElements(prev=>prev.map(x=>x.id===el.id?{...x,rotation:0}:x))} style={{padding:"8px 10px",borderRadius:8,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:11,color:"var(--muted)"}}>0°</button>
            <button onClick={()=>setElements(prev=>prev.map(x=>x.id===el.id?{...x,rotation:((x.rotation||0)+Math.PI/12)%(Math.PI*2)}:x))} style={{flex:1,padding:"8px",borderRadius:8,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:16}}>↻ +15°</button>
          </div>
          <input type="range" min={0} max={360} value={Math.round((el.rotation||0)*180/Math.PI)} onChange={e=>setElements(prev=>prev.map(x=>x.id===el.id?{...x,rotation:Number(e.target.value)*Math.PI/180}:x))} style={{width:"100%",marginTop:6,accentColor:"var(--bronze)"}}/>
        </div>
        <button onClick={deleteSelected} style={{width:"100%",marginTop:4,padding:"9px",borderRadius:9,border:"1.5px solid var(--redL)",background:"transparent",color:"var(--red)",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif"}}>Fjern element</button>
      </div>
    );
  };

  // Which panel content to show
  const panelContent = panel==="addTable" ? <PanelAddTable/>
    : panel==="addElement" ? <PanelAddElement/>
    : sel?.type==="table"   ? <PanelEditTable/>
    : sel?.type==="element" ? <PanelEditElement/>
    : null;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden",background:"#F8F5F0"}}>
      {/* Toolbar */}
      <div style={{flexShrink:0,background:"#3A3028",padding:"10px 14px",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        <button onClick={()=>{setPanel(p=>p==="addTable"?null:"addTable");setSel(null);}}
          style={{padding:"7px 14px",borderRadius:8,border:"none",background:panel==="addTable"?"var(--bronze)":"rgba(255,255,255,.12)",color:"white",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:16}}>⊞</span> + Bord
        </button>
        <button onClick={()=>{setPanel(p=>p==="addElement"?null:"addElement");setSel(null);}}
          style={{padding:"7px 14px",borderRadius:8,border:"none",background:panel==="addElement"?"var(--bronze)":"rgba(255,255,255,.12)",color:"white",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Inter',sans-serif",display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:16}}>◉</span> + Element
        </button>
        <button onClick={fitAll} style={{padding:"7px 12px",borderRadius:8,border:"none",background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif"}}>Vis alt</button>
        <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:11,color:"rgba(255,255,255,.45)"}}>{allSeated.length}/{guests.length} plassert</span>
          {unassigned.length>0&&<div style={{background:"var(--red)",color:"white",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600}}>{unassigned.length} u/bord</div>}
          <button onClick={()=>setScale(s=>Math.min(3,s+.15))} style={{width:28,height:28,borderRadius:6,border:"none",background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:16,lineHeight:1,fontWeight:600}}>+</button>
          <button onClick={()=>setScale(s=>Math.max(.2,s-.15))} style={{width:28,height:28,borderRadius:6,border:"none",background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:16,lineHeight:1,fontWeight:600}}>−</button>
        </div>
      </div>

      {/* Main area: canvas + side panel */}
      <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>
        {/* Canvas */}
        <div ref={wrapRef} style={{flex:1,position:"relative",overflow:"hidden",cursor:drag?"grabbing":panning?"grabbing":"default"}}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={()=>{pinchRef.current=null;}}>
          <canvas ref={canvasRef} style={{display:"block",touchAction:"none",userSelect:"none",width:"100%",height:"100%"}}/>
          {/* Tap hint */}
          {!sel&&!panel&&<div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",background:"rgba(58,48,40,.7)",color:"rgba(255,255,255,.7)",borderRadius:20,padding:"5px 14px",fontSize:11,pointerEvents:"none",backdropFilter:"blur(6px)",whiteSpace:"nowrap"}}>Trykk for å velge · Dra for å flytte · Klype for å zoome</div>}
        </div>

        {/* Side panel */}
        {panelContent&&(
          <div style={{width:260,flexShrink:0,background:"var(--ivory)",borderLeft:"1px solid var(--border)",overflowY:"auto",display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderBottom:"1px solid var(--border)"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:500,color:"var(--text)"}}>
                {panel==="addTable"?"Nytt bord":panel==="addElement"?"Nytt element":selTable?selTable.name:selElement?.label||"Element"}
              </div>
              <button onClick={()=>{setPanel(null);setSel(null);}} style={{background:"var(--stone)",border:"1px solid var(--border)",borderRadius:"50%",width:26,height:26,cursor:"pointer",fontSize:14,color:"var(--muted)"}}>×</button>
            </div>
            {panelContent}
          </div>
        )}
      </div>
    </div>
  );
}

function AIAssistant({ wedding, tasks, guests, budget = [], vendors }) {
  const greet = `Hei${wedding.name1?`, ${wedding.name1}`:""} — jeg er din AI-bryllupsassistent. Spør meg om planlegging, budsjett, etikette eller logistikk. Jeg kjenner bryllupet ditt og gir deg presise, nyttige svar.`;
  const [msgs, setMsgs] = useState([{role:"ai",text:greet}]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollTo({top:scrollRef.current.scrollHeight,behavior:"smooth"}); }, [msgs]);

  const QUICK = [
    "Hva bør vi prioritere nå?",
    "Gi meg et budsjettoverblikk",
    "Hva spør man leverandører om?",
    "Hjelp meg skrive en invitasjonstekst",
  ];

  const send = async (text) => {
    const msg = text || inp.trim();
    if (!msg || loading) return;
    setInp("");
    setMsgs(m => [...m, {role:"user", text:msg}]);
    setLoading(true);

    const totalEst = budget.reduce((s,b)=>s+(b.estimated_cost||0),0);
    const totalAct = budget.reduce((s,b)=>s+(b.actual_cost||0),0);
    const remaining = (wedding.budget_total||0) - totalEst;

    const context = [
      `Bryllupspar: ${wedding.display_name}`,
      `Dato: ${wedding.date || "ikke satt"}`,
      `Sted: ${[wedding.city,wedding.country].filter(Boolean).join(", ") || "ikke satt"}`,
      `Totalbudsjett: ${fmtKr(wedding.budget_total)}`,
      `Estimert brukt: ${fmtKr(totalEst)} — Faktisk brukt: ${fmtKr(totalAct)} — Gjenstår: ${fmtKr(remaining)}`,
      `Gjester: ${guests.length} totalt, ${guests.filter(g=>g.rsvp_status==="accepted").length} bekreftet, ${guests.filter(g=>g.rsvp_status==="pending"||g.rsvp_status==="invited").length} avventer`,
      `Oppgaver: ${tasks.filter(t=>t.status==="done").length} av ${tasks.length} fullført`,
      `Bookede leverandører: ${vendors.filter(v=>v.status==="booked").length} av ${vendors.length}`,
      `Bryllupsstil: ${wedding.wedding_style || "ikke oppgitt"}`,
    ].join(". ");

    // Build clean alternating history — skip greeting, ensure user/assistant alternates
    const history = [];
    for (const m of msgs.slice(1)) {
      const role = m.role === "ai" ? "assistant" : "user";
      if (history.length === 0 || history[history.length-1].role !== role) {
        history.push({role, content: m.text});
      }
    }
    history.push({role:"user", content: msg});

    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 25000);

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: `Du er en personlig AI-bryllupsassistent i "Bryllupsappen". Kontekst: ${context}. Svar alltid på norsk. Vær varm, konkret og nyttig. Maks 3 avsnitt.`,
          messages: history,
        }),
      });
      clearTimeout(tid);

      const raw = await res.text();
      let d;
      try { d = JSON.parse(raw); }
      catch { throw new Error(`Ugyldig svar (${res.status}): ${raw.slice(0,200)}`); }

      if (!res.ok) throw new Error(d?.error?.message || `API-feil ${res.status}`);

      const reply = d.content?.map(b=>b.text||"").join("").trim();
      if (!reply) throw new Error("Tomt svar fra API");
      setMsgs(m => [...m, {role:"ai", text:reply}]);

    } catch(e) {
      const msg = e.name==="AbortError"
        ? "Tok for lang tid (25s). Sjekk nettforbindelsen og prøv igjen."
        : `Noe gikk galt: ${e.message}`;
      setMsgs(m => [...m, {role:"ai", text:msg}]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{flexShrink:0,background:"#3A3028",padding:"16px 20px"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:500,color:"white"}}>AI-assistent</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:2}}>Personlig hjelp for bryllupsplanleggingen</div>
      </div>

      <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"20px 16px"}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:12}}>
            <div className={m.role==="ai"?"chat-bubble-ai":"chat-bubble-user"}
              style={{whiteSpace:"pre-wrap",lineHeight:1.65,fontSize:14}}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",justifyContent:"flex-start",marginBottom:12}}>
            <div className="chat-bubble-ai" style={{display:"flex",gap:6,padding:"14px 16px"}}>
              {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"var(--faint)",animation:`pulse 1.2s ${i*0.2}s infinite`}}/>)}
            </div>
          </div>
        )}
      </div>

      {/* Quick prompts */}
      <div style={{padding:"0 16px 8px",display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none"}}>
        {QUICK.map(q=>(
          <button key={q} onClick={()=>send(q)}
            style={{flexShrink:0,padding:"7px 13px",borderRadius:20,border:"1.5px solid var(--border)",background:"white",fontSize:12,color:"var(--text)",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Inter',sans-serif",fontWeight:500}}>
            {q}
          </button>
        ))}
      </div>

      <div style={{padding:"8px 16px",paddingBottom:"calc(8px + env(safe-area-inset-bottom,0px))",borderTop:"1px solid var(--border)",background:"white",display:"flex",gap:8}}>
        <input className="inp" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Still et spørsmål..." style={{minHeight:40,fontSize:14}}/>
        <button className="btn btn-primary btn-sm" style={{flexShrink:0,minHeight:40,padding:"0 16px"}} onClick={()=>send()} disabled={loading||!inp.trim()}>Send</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   VENDOR PORTAL — leverandørens side
═══════════════════════════════════════════════════════════ */
function VendorPortal({ wedding, vendors, setVendors, chats, setChats, showToast, onBack }) {
  const [selVendor, setSelVendor] = useState(null);
  const [chatMsg,   setChatMsg]   = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [selVendor, chats, activeTab]);

  // Mark planner messages as read when vendor opens chat
  useEffect(()=>{
    if (!selVendor) return;
    setChats(c=>({...c,[selVendor.id]:(c[selVendor.id]||[]).map(m=>m.from==="planner"?{...m,read:true}:m)}));
  },[selVendor]);

  const wDate  = wedding?.date ? new Date(wedding.date).toLocaleDateString("nb-NO",{weekday:"long",day:"numeric",month:"long",year:"numeric"}) : "Dato ikke satt";
  const wVenue = wedding?.venue || wedding?.city || "lokalet";
  const couple = `${wedding?.name1||""}${wedding?.name2?" & "+wedding.name2:""}`;

  const sendMsg = () => {
    if (!chatMsg.trim()||!selVendor) return;
    const msg = {
      id:Date.now(), from:"vendor",
      text:chatMsg.trim(),
      ts:new Date().toLocaleTimeString("nb-NO",{hour:"2-digit",minute:"2-digit"}),
      read:false
    };
    setChats(c=>({...c,[selVendor.id]:[...(c[selVendor.id]||[]),msg]}));
    setChatMsg("");
    // Mark as unread for planner (they see it next time they open vendors)
    showToast(`Melding sendt til ${couple}`);
  };

  const updateStatus = (vid, status) => {
    setVendors(prev=>prev.map(v=>v.id===vid?{...v,status}:v));
    showToast("Status oppdatert");
  };

  const VENDOR_STATUS_LABELS2 = {
    researching:"Undersøkes",contacted:"Kontaktet",quote_received:"Tilbud sendt",shortlisted:"Shortlistet",booked:"Bekreftet / Booket",rejected:"Avslått"
  };

  // ── Vendor selection screen ──
  if (!selVendor) {
    return (
      <div style={{display:"flex",flexDirection:"column",height:"100dvh",width:"100%",overflow:"hidden",background:"var(--ivory)"}}>
        {/* Hero */}
        <div style={{flexShrink:0,background:"#3A3028",padding:"28px 20px 24px",textAlign:"center",position:"relative"}}>
          <button onClick={onBack} style={{position:"absolute",top:14,left:14,background:"rgba(255,255,255,.1)",border:"none",color:"rgba(255,255,255,.55)",borderRadius:20,padding:"6px 14px",cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif"}}>
            ← Tilbake
          </button>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:10,letterSpacing:".3em",textTransform:"uppercase",color:"rgba(255,255,255,.35)",marginBottom:8}}>Leverandørportal</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:500,color:"white",marginBottom:4}}>{couple}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.45)"}}>{wDate}</div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"var(--text)",marginBottom:6}}>Hvem er du?</div>
          <div style={{fontSize:13,color:"var(--muted)",marginBottom:16,lineHeight:1.6}}>Velg din bedrift under for å åpne din side.</div>

          {vendors.length===0 ? (
            <div style={{textAlign:"center",padding:"40px 20px",color:"var(--muted)",fontSize:14}}>
              Ingen leverandører er lagt til ennå.
            </div>
          ) : vendors.map(v=>{
            const msgs = chats[v.id]||[];
            const unread = msgs.filter(m=>m.from==="planner"&&!m.read).length;
            const lastMsg = msgs[msgs.length-1];
            return (
              <div key={v.id} onClick={()=>setSelVendor(v)}
                style={{background:"var(--white)",borderRadius:14,border:`1.5px solid ${unread>0?"var(--bronze)":"var(--border)"}`,padding:"16px",marginBottom:10,cursor:"pointer",transition:"all .15s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--bronze)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor=unread>0?"var(--bronze)":"var(--border)"}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:48,height:48,borderRadius:12,background:v.status==="booked"?"var(--bronzeL)":"var(--stone)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:"var(--bronze2)",fontFamily:"'Playfair Display',serif",flexShrink:0}}>
                    {v.name[0]}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:500,color:"var(--text)",marginBottom:2}}>{v.name}</div>
                    <div style={{fontSize:12,color:"var(--muted)"}}>{v.category}{v.contact_name?` · ${v.contact_name}`:""}</div>
                    {lastMsg&&<div style={{fontSize:12,color:"var(--muted)",marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {lastMsg.from==="planner"?"Brudeparet:":"Du:"} {lastMsg.text}
                    </div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    <span style={{fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:20,background:v.status==="booked"?"var(--greenL)":"var(--stone)",color:v.status==="booked"?"var(--green)":"var(--muted)"}}>
                      {VENDOR_STATUS_LABELS2[v.status]||v.status}
                    </span>
                    {unread>0&&<span style={{background:"var(--bronze)",color:"white",borderRadius:10,padding:"2px 8px",fontSize:11,fontWeight:700}}>{unread} ny</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const msgs = chats[selVendor?.id]||[];
  const TABS = [{id:"chat",label:"Chat"},{id:"info",label:"Oppdragsinfo"},{id:"status",label:"Status"}];

  const QUICK = [
    "Hei! Vi bekrefter mottak av din melding.",
    "Vi sjekker ledighet og kommer tilbake snart.",
    "Vi kan bekrefte at vi er tilgjengelige den datoen.",
    "Kontrakten er sendt til din e-post.",
    "Vi trenger litt mer informasjon — kan dere ringe oss?",
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      {/* Header */}
      <div style={{flexShrink:0,background:"#3A3028",padding:"12px 14px",display:"flex",gap:10,alignItems:"center"}}>
        <button onClick={()=>setSelVendor(null)}
          style={{background:"rgba(255,255,255,.1)",border:"none",color:"rgba(255,255,255,.6)",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,flexShrink:0,fontWeight:600}}>
          ←
        </button>
        <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"white",fontFamily:"'Playfair Display',serif",fontWeight:700,flexShrink:0}}>
          {selVendor.name[0]}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:"white",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selVendor.name}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>{selVendor.category}{selVendor.contact_name?` · ${selVendor.contact_name}`:""}</div>
        </div>
        <span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,background:selVendor.status==="booked"?"rgba(74,124,92,.4)":"rgba(255,255,255,.1)",color:selVendor.status==="booked"?"#9FD4B0":"rgba(255,255,255,.5)"}}>
          {VENDOR_STATUS_LABELS2[selVendor.status]||selVendor.status}
        </span>
      </div>

      {/* Tab bar */}
      <div style={{flexShrink:0,display:"flex",background:"#2A2018",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{flex:1,padding:"11px",border:"none",background:"transparent",color:activeTab===t.id?"var(--bronze)":"rgba(255,255,255,.35)",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:12,cursor:"pointer",borderBottom:`2px solid ${activeTab===t.id?"var(--bronze)":"transparent"}`,transition:"all .15s"}}>
            {t.label}
            {t.id==="chat"&&msgs.filter(m=>m.from==="planner").length>0&&<span style={{marginLeft:5,background:"var(--bronze)",color:"white",borderRadius:10,padding:"1px 6px",fontSize:9,fontWeight:700}}>{msgs.length}</span>}
          </button>
        ))}
      </div>

      {/* Tab: Chat */}
      {activeTab==="chat"&&(
        <>
          <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"16px",background:"#F0EDE8",display:"flex",flexDirection:"column",gap:8}}>
            {msgs.length===0&&(
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                <div style={{fontSize:32,marginBottom:8}}>💬</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:"var(--text)",marginBottom:8}}>Ingen meldinger ennå</div>
                <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:20}}>
                  {couple} har ikke sendt noen meldinger ennå. Du kan starte samtalen:
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {QUICK.slice(0,3).map(q=>(
                    <button key={q} onClick={()=>setChatMsg(q)}
                      style={{padding:"10px 14px",borderRadius:12,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:13,fontFamily:"'Inter',sans-serif",textAlign:"left",color:"var(--text)",lineHeight:1.5}}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m,i)=>{
              const isMe = m.from==="vendor";
              return (
                <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:isMe?"flex-end":"flex-start"}}>
                  {!isMe&&i===0&&<div style={{fontSize:10,color:"var(--muted)",marginBottom:4,fontWeight:600}}>{couple}</div>}
                  {isMe&&i===0&&<div style={{fontSize:10,color:"var(--muted)",marginBottom:4,fontWeight:600}}>{selVendor.contact_name||selVendor.name}</div>}
                  <div style={{
                    maxWidth:"80%",padding:"10px 14px",fontSize:14,lineHeight:1.6,boxShadow:"0 1px 4px rgba(0,0,0,.08)",
                    background:isMe?"#3A3028":"white",
                    color:isMe?"white":"var(--text)",
                    borderRadius:isMe?"16px 16px 4px 16px":"16px 16px 16px 4px",
                  }}>
                    {m.text}
                  </div>
                  <div style={{fontSize:10,color:"var(--faint)",marginTop:3}}>{m.ts}{isMe&&" · Sendt"}</div>
                </div>
              );
            })}
          </div>

          {/* Quick reply chips */}
          {msgs.length>0&&(
            <div style={{flexShrink:0,padding:"8px 12px 0",background:"#F0EDE8",overflowX:"auto",whiteSpace:"nowrap",scrollbarWidth:"none",display:"flex",gap:6}}>
              {QUICK.map(q=>(
                <button key={q} onClick={()=>setChatMsg(q)}
                  style={{padding:"5px 12px",borderRadius:16,border:"1.5px solid var(--border)",background:"white",cursor:"pointer",fontSize:11,fontFamily:"'Inter',sans-serif",color:"var(--text)",flexShrink:0,fontWeight:500}}>
                  {q.length>28?q.slice(0,27)+"…":q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{flexShrink:0,background:"white",borderTop:"1px solid var(--border)",padding:"10px 12px",display:"flex",gap:8,alignItems:"flex-end"}}>
            <textarea value={chatMsg} onChange={e=>setChatMsg(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg();}}}
              placeholder={`Svar til ${couple}…`} rows={1}
              style={{flex:1,resize:"none",border:"1.5px solid var(--border)",borderRadius:12,padding:"10px 14px",fontSize:14,fontFamily:"'Inter',sans-serif",outline:"none",lineHeight:1.5,color:"var(--text)",background:"var(--stone)",minHeight:42,maxHeight:120,overflow:"auto"}}/>
            <button onClick={sendMsg}
              style={{width:42,height:42,borderRadius:12,border:"none",background:chatMsg.trim()?"#3A3028":"var(--border)",color:"white",cursor:chatMsg.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,transition:"background .15s",flexShrink:0}}>
              ↑
            </button>
          </div>
        </>
      )}

      {/* Tab: Oppdragsinfo */}
      {activeTab==="info"&&(
        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"var(--text)",marginBottom:16}}>Oppdragsdetaljer</div>
          {[
            {label:"Bryllupspar",    value:couple},
            {label:"Dato",           value:wDate},
            {label:"Sted",           value:wVenue},
            {label:"Antall gjester", value:wedding?.guest_count||"Ikke oppgitt"},
            {label:"Bryllupsstil",   value:wedding?.wedding_style||"Ikke oppgitt"},
            {label:"Din kategori",   value:selVendor.category},
            {label:"Din status",     value:VENDOR_STATUS_LABELS2[selVendor.status]||selVendor.status},
            {label:"Estimert beløp", value:selVendor.price_estimate>0?fmtKr(selVendor.price_estimate):"Ikke satt"},
            {label:"Fakturert",      value:selVendor.price_actual>0?fmtKr(selVendor.price_actual):"Ikke fakturert"},
          ].map(r=>(
            <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
              <span style={{fontSize:12,color:"var(--muted)",fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}>{r.label}</span>
              <span style={{fontSize:14,fontWeight:500,color:"var(--text)",textAlign:"right",maxWidth:"55%"}}>{r.value}</span>
            </div>
          ))}
          {selVendor.notes&&(
            <div style={{marginTop:14,padding:"14px",background:"var(--bronzeL)",borderRadius:10,fontSize:13,lineHeight:1.6,color:"var(--bronze2)"}}>
              <strong>Notater fra brudeparet:</strong><br/>{selVendor.notes}
            </div>
          )}
          {(selVendor.website) && (
            <a href={selVendor.website} target="_blank" rel="noopener noreferrer"
              style={{display:"block",marginTop:12,padding:"12px",borderRadius:10,border:"1.5px solid var(--border)",background:"var(--white)",textAlign:"center",fontSize:13,color:"var(--bronze)",fontWeight:600,fontFamily:"'Inter',sans-serif",textDecoration:"none"}}>
              Åpne din nettside →
            </a>
          )}
        </div>
      )}

      {/* Tab: Status */}
      {activeTab==="status"&&(
        <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"var(--text)",marginBottom:6}}>Oppdater status</div>
          <div style={{fontSize:13,color:"var(--muted)",marginBottom:20,lineHeight:1.6}}>Oppdater din booking-status slik at brudeparet ser fremdriften.</div>
          {Object.entries(VENDOR_STATUS_LABELS2).map(([k,v])=>{
            const isActive = selVendor.status===k;
            const colors = {researching:["var(--muted)","var(--stone)"],contacted:["#4A6E8A","#E4EEF5"],quote_received:["var(--amber)","rgba(196,128,58,.1)"],shortlisted:["var(--bronze)","var(--bronzeL)"],booked:["var(--green)","var(--greenL)"],rejected:["var(--red)","var(--redL)"]};
            const [col,bg] = colors[k]||["var(--muted)","var(--stone)"];
            return (
              <button key={k} onClick={()=>{
                const updated = {...selVendor, status:k};
                setSelVendor(updated);
                updateStatus(selVendor.id, k);
              }}
                style={{width:"100%",marginBottom:8,padding:"14px 16px",borderRadius:12,border:`2px solid ${isActive?col:"var(--border)"}`,background:isActive?bg:"var(--white)",cursor:"pointer",display:"flex",alignItems:"center",gap:12,fontFamily:"'Inter',sans-serif",transition:"all .15s",textAlign:"left"}}>
                <div style={{width:12,height:12,borderRadius:"50%",background:isActive?col:"var(--border)",flexShrink:0}}/>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:isActive?col:"var(--text)"}}>{v}</div>
                </div>
                {isActive&&<span style={{marginLeft:"auto",fontSize:12,color:col,fontWeight:700}}>✓ Aktiv</span>}
              </button>
            );
          })}
          <div style={{marginTop:16,padding:"12px 14px",background:"var(--bronzeL)",borderRadius:10,fontSize:13,color:"var(--bronze2)",lineHeight:1.6}}>
            💡 Statusendringer er synlige for brudeparet umiddelbart i planneren.
          </div>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   GUEST PORTAL
═══════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   GUEST PORTAL — full feature set
═══════════════════════════════════════════════════════════ */

const DEMO_MENU = [
  {course:"Forrett",   name:"Carpaccio di Manzo",         desc:"Tynne skiver av indrefilet, rucola, parmesanspon og kapers", diet:["Glutenfri"]},
  {course:"Forrett",   name:"Suppe av jordskokk",          desc:"Kremet suppe med trøffelolje og sprøtt rugbrød",             diet:["Vegetar"]},
  {course:"Hovedrett", name:"Biff med béarnaise",           desc:"Norsk oksemørbrad, pommes fondant og sauterte bønner",       diet:[]},
  {course:"Hovedrett", name:"Laks med sitronbeurre blanc",  desc:"Atlantisk laks, dampede grønnsaker og risotto",              diet:["Glutenfri"]},
  {course:"Hovedrett", name:"Risotto ai funghi",            desc:"Kremet sopprisotto med trøffelolje og parmesan",             diet:["Vegetar"]},
  {course:"Dessert",   name:"Panna cotta med bærkulis",     desc:"Kremete vanilje, friske bær og crisp",                      diet:["Glutenfri"]},
  {course:"Bryllupskake", name:"3-etasjers hvit kake",     desc:"Konditori Haugen · Friske blomster og sitronkrem",           diet:[]},
];






/* ═══════════════════════════════════════════════════════════
   GUEST PORTAL — single flat component, no nested functions
═══════════════════════════════════════════════════════════ */
function GuestPortal({ wedding, guests, setGuests, gifts: giftsProp, setGifts: setGiftsProp, currentUser,
  photos: photosProp, setPhotos: setPhotosProp, songs: songsProp, setSongs: setSongsProp,
  guestbook: guestbookProp, setGuestbook: setGuestbookProp,
  bookings: bookingsProp, setBookings: setBookingsProp,
  showToast, onBack }) {

  const [tab, setTab] = useState("invitation");

  /* ── Shared state bridges ── */
  const [giftsL,     setGiftsL]     = useState(giftsProp     || INITIAL_GIFTS);
  const [photosL,    setPhotosL]    = useState(photosProp    || INITIAL_PHOTOS);
  const [songsL,     setSongsL]     = useState(songsProp     || INITIAL_SONGS);
  const [entriesL,   setEntriesL]   = useState(guestbookProp || INITIAL_GUESTBOOK);
  const [bookingsL,  setBookingsL]  = useState(bookingsProp  || INITIAL_BOOKINGS);

  const gifts    = giftsProp    !== undefined ? giftsProp    : giftsL;
  const setGifts = setGiftsProp !== undefined ? setGiftsProp : setGiftsL;
  const photos   = photosProp   !== undefined ? photosProp   : photosL;
  const setPhotos= setPhotosProp!== undefined ? setPhotosProp: setPhotosL;
  const songs    = songsProp    !== undefined ? songsProp    : songsL;
  const setSongs = setSongsProp !== undefined ? setSongsProp : setSongsL;
  const entries  = guestbookProp!== undefined ? guestbookProp: entriesL;
  const setEntries=setGuestbookProp!==undefined?setGuestbookProp:setEntriesL;
  const bookings = bookingsProp !==undefined ? bookingsProp  : bookingsL;
  const setBookings=setBookingsProp!==undefined?setBookingsProp:setBookingsL;

  /* ── Derived wedding values ── */
  const name1  = wedding?.name1  || "Brud";
  const name2  = wedding?.name2  || "Brudgom";
  const couple = `${name1} & ${name2}`;
  const wDate  = wedding?.date
    ? new Date(wedding.date).toLocaleDateString("nb-NO",{weekday:"long",day:"numeric",month:"long",year:"numeric"})
    : "Dato ikke satt";
  const wDay   = wedding?.date
    ? new Date(wedding.date).toLocaleDateString("nb-NO",{day:"numeric",month:"long"})
    : "";
  const wVenue  = wedding?.venue || wedding?.city || "lokalet";
  const daysLeft= wedding?.date ? Math.max(0,Math.floor((new Date(wedding.date)-Date.now())/86400000)) : null;

  /* ── RSVP state ── */
  // Pre-find the guest from the guest list by name
  const [myGuest,  setMyGuest]  = useState(() => {
    if (!currentUser?.name) return null;
    return (guests||[]).find(g =>
      `${g.first_name} ${g.last_name}`.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      g.first_name.toLowerCase() === currentUser.name.toLowerCase()
    ) || null;
  });
  const [rsvp,     setRsvp]     = useState(null);
  const [allergy,  setAllergy]  = useState("");
  const [plusName, setPlusName] = useState("");
  const [rsvpSent, setRsvpSent] = useState(false);
  const [gSearch,  setGSearch]  = useState("");

  const submitRsvp = () => {
    if (!rsvp) return;
    if (myGuest) setGuests(prev=>prev.map(g=>g.id===myGuest.id
      ?{...g,rsvp_status:rsvp==="yes"?"accepted":"declined",allergies:allergy||g.allergies,plus_one_name:plusName||g.plus_one_name}:g));
    setRsvpSent(true);
    showToast(rsvp==="yes"?"Svar registrert — vi gleder oss! 🎉":"Svar registrert.");
  };

  /* ── Menu state ── */
  const [menuChoice, setMenuChoice] = useState({s:null,m:null});
  const [menuSaved,  setMenuSaved]  = useState(false);

  /* ── Booking state ── */
  const [booked, setBooked] = useState({});

  /* ── Gift state ── */
  const [confirm, setConfirm] = useState(null);

  /* ── Photo state ── */
  const [caption,   setCaption]   = useState("");
  const [uploading, setUploading] = useState(false);
  const [lightbox,  setLightbox]  = useState(null);
  const PHOTO_COLORS = ["#f5e8e8","#f0ede4","#e8f0e8","#e8eaf5","#f5f0e8","#e8f0f5"];
  const PHOTO_EMOJIS = ["📸","🌸","🥂","💐","🎵","✨","💍","🎊","🌹","🕯️"];

  /* ── Music state ── */
  const [songT, setSongT] = useState("");
  const [songA, setSongA] = useState("");

  /* ── Guestbook state ── */
  const [gbMsg,  setGbMsg]  = useState("");
  const [gbSent, setGbSent] = useState(false);

  const TABS = [
    {id:"invitation",label:"Invitasjon",icon:"✉"},
    {id:"program",   label:"Program",   icon:"▤"},
    {id:"menu",      label:"Meny",      icon:"◉"},
    {id:"practical", label:"Praktisk",  icon:"◷"},
    {id:"rsvp",      label:"Svar",      icon:"✦"},
    {id:"booking",   label:"Booking",   icon:"◎"},
    {id:"gifts",     label:"Ønskeliste",icon:"◇"},
    {id:"photos",    label:"Bilder",    icon:"◫"},
    {id:"music",     label:"Musikk",    icon:"♪"},
    {id:"guestbook", label:"Gjestebok", icon:"✐"},
  ];

  /* ── Shared style helpers (plain objects, not components) ── */
  const wrapStyle = {padding:"16px 16px 48px",maxWidth:560,margin:"0 auto"};
  const cardStyle = (extra={}) => ({background:"var(--white)",borderRadius:14,border:"1px solid var(--border)",padding:"16px",marginBottom:12,...extra});
  const titleStyle = {fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:500,color:"var(--text)",marginBottom:4};
  const subStyle   = {fontSize:13,color:"var(--muted)",marginBottom:20,lineHeight:1.6};
  const labelStyle = {fontSize:11,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)",marginBottom:10};
  const radioStyle = (on) => ({width:22,height:22,borderRadius:"50%",border:`2px solid ${on?"var(--bronze)":"var(--border)"}`,background:on?"var(--bronze)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all .15s"});

  /* ══════════════════════════════════════════════
     TAB CONTENT — rendered inline via switch
  ══════════════════════════════════════════════ */
  const renderContent = () => {
    switch(tab) {

      /* ── INVITATION ── */
      case "invitation": return (
        <div style={wrapStyle}>
          <div style={{...titleStyle,marginBottom:6}}>Kjære {name1 === wedding?.name1 ? name1 : "gjest"}</div>
          <div style={subStyle}>Du er invitert til bryllupet!</div>
          <div style={cardStyle()}>
            <div style={{fontSize:14,lineHeight:1.8,marginBottom:14}}>
              Vi har gleden av å invitere deg til å feire den spesielle dagen vår!<br/><br/>
              {couple} gifter seg {wDay}, og vi ønsker deg hjertelig velkommen.
            </div>
            {[["Dato",wDate],["Sted",wVenue],["Kleskode",wedding?.dress||"Ikke oppgitt"]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:"1px solid var(--border)"}}>
                <span style={{fontSize:11,color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase"}}>{l}</span>
                <span style={{fontSize:14,fontWeight:500,textAlign:"right",maxWidth:"60%"}}>{v}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-full" onClick={()=>setTab("rsvp")}>Svar på invitasjonen →</button>
        </div>
      );

      /* ── PROGRAM ── */
      case "program": return (
        <div style={wrapStyle}>
          <div style={titleStyle}>Program for dagen</div>
          <div style={cardStyle()}>
            {[
              ["13:30","Gjestene ankommer","🚗"],["14:00","Vielsesseremoni","💍"],
              ["15:00","Champagneresepsjon","🥂"],["17:00","Middagen serveres","🍽"],
              ["18:00","Taler og underholdning","🎤"],["20:00","Kakeserveringen","🎂"],
              ["21:00","Dansegulvet åpner","🎵"],["02:00","Nattmat og farvel","🌙"],
            ].map(([tid,tittel,icon],i,arr)=>(
              <div key={tid} style={{display:"flex",gap:12,padding:`${i>0?"14px":"0"} 0 ${i<arr.length-1?"14px":"0"}`,borderTop:i>0?"1px solid var(--border)":"none"}}>
                <div style={{width:44,flexShrink:0,textAlign:"right",fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:"var(--bronze)",paddingTop:2}}>{tid}</div>
                <span style={{fontSize:18,flexShrink:0,lineHeight:1.3}}>{icon}</span>
                <div style={{fontSize:14,fontWeight:500,paddingTop:1}}>{tittel}</div>
              </div>
            ))}
          </div>
        </div>
      );

      /* ── MENU ── */
      case "menu": return (
        <div style={wrapStyle}>
          <div style={titleStyle}>Velg din meny</div>
          <div style={{...subStyle,marginBottom:14}}>Oppgi preferanser før bryllupet.</div>
          {[{key:"s",label:"Forrett",filter:"Forrett"},{key:"m",label:"Hovedrett",filter:"Hovedrett"}].map(sec=>(
            <div key={sec.key} style={cardStyle()}>
              <div style={labelStyle}>Velg {sec.label.toLowerCase()}</div>
              {DEMO_MENU.filter(m=>m.course.startsWith(sec.filter)).map((m,i)=>{
                const on=menuChoice[sec.key]===m.name;
                return (
                  <div key={i} onClick={()=>setMenuChoice(c=>({...c,[sec.key]:m.name}))}
                    style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)",cursor:"pointer",alignItems:"flex-start"}}>
                    <div style={radioStyle(on)}>{on&&<div style={{width:8,height:8,borderRadius:"50%",background:"white"}}/>}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:500,marginBottom:2}}>{m.name}</div>
                      <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>{m.desc}</div>
                      {m.diet.length>0&&<div style={{marginTop:5,display:"flex",gap:4}}>{m.diet.map(d=><span key={d} style={{fontSize:10,background:"var(--sageL)",color:"var(--sage)",borderRadius:10,padding:"2px 8px",fontWeight:600}}>{d}</span>)}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div style={cardStyle()}>
            <div style={labelStyle}>Dessert & kake — inkludert for alle</div>
            {DEMO_MENU.filter(m=>m.course==="Dessert"||m.course==="Bryllupskake").map((m,i)=>(
              <div key={i} style={{padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{fontSize:10,color:"var(--muted)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:2}}>{m.course}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,marginBottom:2}}>{m.name}</div>
                <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>{m.desc}</div>
              </div>
            ))}
          </div>
          {(menuChoice.s||menuChoice.m)&&<button className="btn btn-primary btn-full" onClick={()=>{setMenuSaved(true);showToast("Menyvalg lagret 🍽");}}>{menuSaved?"✓ Lagret!":"Bekreft menyvalg"}</button>}
        </div>
      );

      /* ── PRACTICAL ── */
      case "practical": return (
        <div style={wrapStyle}>
          <div style={titleStyle}>Praktisk info</div>
          {[
            ["📍","Sted og adresse",`${wVenue}\n${wedding?.city||""}, ${wedding?.country||"Norge"}`],
            ["🚌","Shuttlebuss","Avgang fra Oslo S kl. 13:00 og 13:30. Retur ca 01:30."],
            ["🏨","Overnatting","Hotellrom tilgjengelig. Spesialpris for bryllupsgjester."],
            ["👗","Kleskode",wedding?.dress||"Ikke oppgitt"],
            ["🚗","Parkering","Gratis parkering på eiendommen."],
          ].map(([icon,title,content])=>(
            <div key={title} style={cardStyle({display:"flex",gap:12,alignItems:"flex-start"})}>
              <span style={{fontSize:22,flexShrink:0}}>{icon}</span>
              <div>
                <div style={{...labelStyle,marginBottom:6}}>{title}</div>
                <div style={{fontSize:14,color:"var(--text)",lineHeight:1.65,whiteSpace:"pre-line"}}>{content}</div>
              </div>
            </div>
          ))}
        </div>
      );

      /* ── RSVP ── */
      case "rsvp": return (
        <div style={wrapStyle}>
          <div style={titleStyle}>Svar på invitasjonen</div>
          {rsvpSent ? (
            <div style={{...cardStyle(),textAlign:"center",padding:"40px 20px"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:rsvp==="yes"?"var(--green)":"var(--muted)",marginBottom:8}}>
                {rsvp==="yes"?"Vi gleder oss til å se deg! 🎉":"Synd du ikke kan komme."}
              </div>
              <button className="btn btn-outline btn-sm" style={{marginTop:16}} onClick={()=>setRsvpSent(false)}>Endre svar</button>
            </div>
          ) : (
            <>
              {!myGuest&&(
                <div style={cardStyle()}>
                  <div style={labelStyle}>Finn deg i gjestelisten (valgfritt)</div>
                  <input className="inp" placeholder="Skriv fornavn…" value={gSearch} onChange={e=>setGSearch(e.target.value)} style={{marginBottom:8}}/>
                  {gSearch.length>1&&guests.filter(g=>`${g.first_name} ${g.last_name}`.toLowerCase().includes(gSearch.toLowerCase())).slice(0,5).map(g=>(
                    <div key={g.id} onClick={()=>{setMyGuest(g);setGSearch("");setAllergy(g.allergies||"");setPlusName(g.plus_one_name||"");setRsvp(g.rsvp_status==="accepted"?"yes":g.rsvp_status==="declined"?"no":null);}}
                      style={{padding:"10px 14px",background:"var(--stone)",borderRadius:9,marginBottom:6,cursor:"pointer",fontSize:14,fontWeight:500}}>
                      {g.first_name} {g.last_name}
                    </div>
                  ))}
                </div>
              )}
              {myGuest&&<div style={{background:"var(--bronzeL)",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,fontWeight:600,color:"var(--bronze2)"}}>Hei, {myGuest.first_name}!</span>
                <button onClick={()=>setMyGuest(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"var(--muted)"}}>Bytt</button>
              </div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                {[["yes","Ja, jeg kommer 🎉"],["no","Kan ikke komme"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setRsvp(k)}
                    style={{padding:"18px 8px",borderRadius:12,border:`2px solid ${rsvp===k?(k==="yes"?"var(--green)":"var(--red)"):"var(--border)"}`,background:rsvp===k?(k==="yes"?"var(--greenL)":"var(--redL)"):"var(--white)",cursor:"pointer",fontFamily:"'Playfair Display',serif",fontSize:14,color:rsvp===k?(k==="yes"?"var(--green)":"var(--red)"):"var(--muted)",lineHeight:1.3}}>
                    {l}
                  </button>
                ))}
              </div>
              {rsvp==="yes"&&<div style={cardStyle()}>
                <div className="inp-wrap"><label className="label">Allergier / matbehov</label><input className="inp" value={allergy} onChange={e=>setAllergy(e.target.value)} placeholder="f.eks. nøtter, gluten…"/></div>
                <div className="inp-wrap"><label className="label">Ledsager (la stå tomt om du kommer alene)</label><input className="inp" value={plusName} onChange={e=>setPlusName(e.target.value)} placeholder="Ledsagerens fulle navn"/></div>
              </div>}
              <button className="btn btn-primary btn-full" style={{opacity:rsvp?1:.5}} onClick={submitRsvp}>Send svar</button>
            </>
          )}
        </div>
      );

      /* ── BOOKING ── */
      case "booking": return (
        <div style={wrapStyle}>
          <div style={titleStyle}>Booking</div>
          <div style={{...subStyle}}>Shuttlebuss, overnatting og tillegg.</div>
          {bookings.map(o=>{
            const on=!!booked[o.id];
            const pct=Math.round((o.taken/Math.max(o.slots,1))*100);
            const left=o.slots-o.taken-(on?1:0);
            return (
              <div key={o.id} style={cardStyle()}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
                  <span style={{fontSize:26,flexShrink:0}}>{o.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,marginBottom:2}}>{o.name}</div>
                    <div style={{fontSize:12,color:"var(--muted)",marginBottom:6,lineHeight:1.5}}>{o.desc}</div>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:14,fontWeight:600,color:"var(--bronze)"}}>{o.price}</span>
                      {o.slots<99&&<span style={{fontSize:11,color:left<4?"var(--red)":"var(--muted)"}}>{left} plasser igjen</span>}
                    </div>
                  </div>
                </div>
                {o.slots<99&&<Prog pct={pct+(on?2:0)} color={pct>80?"var(--red)":"var(--sage)"} h={5}/>}
                <button className="btn btn-full" style={{marginTop:10,...(on?{background:"transparent",color:"var(--green)",border:"1.5px solid var(--green)"}:{background:"var(--text)",color:"white"})}}
                  onClick={()=>{setBooked(b=>({...b,[o.id]:!b[o.id]}));showToast(on?"Avmeldt":"Påmeldt! ✓");}}>
                  {on?"✓ Påmeldt — klikk for å melde av":"Meld meg på"}
                </button>
              </div>
            );
          })}
        </div>
      );

      /* ── GIFTS ── */
      case "gifts": {
        const free  = gifts.filter(g=>!g.takenBy);
        const taken = gifts.filter(g=>g.takenBy);
        const take   = id=>{setGifts(g=>g.map(x=>x.id===id?{...x,takenBy:"meg"}:x));setConfirm(null);showToast("Gave registrert! 🎁");};
        const untake = id=>{setGifts(g=>g.map(x=>x.id===id?{...x,takenBy:null}:x));showToast("Angret");};
        return (
          <div style={wrapStyle}>
            <div style={titleStyle}>Ønskeliste</div>
            <div style={{background:"var(--bronzeL)",border:"1px solid rgba(184,149,106,.2)",borderRadius:12,padding:14,marginBottom:12,fontSize:13,lineHeight:1.6,color:"var(--bronze2)"}}>
              💛 Andre gjester ser bare at en gave er tatt, ikke hvem.
            </div>
            <div style={cardStyle()}>
              <div style={labelStyle}>Tilgjengelig ({free.length})</div>
              {free.map(g=>(
                <div key={g.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{fontSize:26,flexShrink:0}}>{g.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</div>
                    <div style={{fontSize:12,color:"var(--muted)",marginTop:1}}>{g.price.toLocaleString("nb-NO")} kr</div>
                  </div>
                  <button className="btn btn-bronze btn-sm" onClick={()=>setConfirm(g.id)}>Velg</button>
                </div>
              ))}
              {free.length===0&&<div style={{textAlign:"center",padding:"16px 0",fontSize:13,color:"var(--muted)"}}>Alle gaver er valgt! 🎉</div>}
            </div>
            {taken.length>0&&<div style={cardStyle()}>
              <div style={labelStyle}>Allerede valgt ({taken.length})</div>
              {taken.map(g=>(
                <div key={g.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)",opacity:.55}}>
                  <span style={{fontSize:22,flexShrink:0}}>{g.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,textDecoration:"line-through",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{g.takenBy==="meg"?"Valgt av deg":"Valgt"} · {g.price.toLocaleString("nb-NO")} kr</div>
                  </div>
                  {g.takenBy==="meg"&&<button className="btn btn-outline btn-sm" onClick={()=>untake(g.id)}>Angre</button>}
                </div>
              ))}
            </div>}
            {confirm&&(
              <Sheet title="Bekreft gave" onClose={()=>setConfirm(null)}>
                <div style={{textAlign:"center",marginBottom:16}}><span style={{fontSize:52}}>{gifts.find(g=>g.id===confirm)?.icon}</span></div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,textAlign:"center",marginBottom:4}}>{gifts.find(g=>g.id===confirm)?.name}</div>
                <div style={{fontSize:13,color:"var(--muted)",textAlign:"center",marginBottom:20}}>{gifts.find(g=>g.id===confirm)?.price.toLocaleString("nb-NO")} kr</div>
                <button className="btn btn-primary btn-full mb8" onClick={()=>take(confirm)}>Ja, jeg gir denne!</button>
                <button className="btn btn-outline btn-full" onClick={()=>setConfirm(null)}>Avbryt</button>
              </Sheet>
            )}
          </div>
        );
      }

      /* ── PHOTOS ── */
      case "photos": return (
        <div style={wrapStyle}>
          <div style={titleStyle}>Bildedeling</div>
          <div style={{...subStyle}}>{photos.length} bilder delt</div>
          <div style={cardStyle()}>
            <div style={labelStyle}>Del ditt øyeblikk</div>
            <div style={{background:"var(--stone)",borderRadius:12,padding:"20px",textAlign:"center",marginBottom:10,cursor:"pointer",border:"2px dashed var(--border)"}}
              onClick={()=>{if(uploading)return;setUploading(true);setTimeout(()=>{setPhotos(p=>[{id:Date.now(),by:"meg",emoji:PHOTO_EMOJIS[Math.floor(Math.random()*PHOTO_EMOJIS.length)],color:PHOTO_COLORS[Math.floor(Math.random()*PHOTO_COLORS.length)],caption},...p]);setCaption("");setUploading(false);showToast("Bilde delt! 📸");},900);}}>
              <div style={{fontSize:32,marginBottom:6}}>📷</div>
              <div style={{fontSize:13,color:"var(--text)"}}>{uploading?"⏳ Laster opp…":"Trykk for å dele bilde"}</div>
            </div>
            <input className="inp" value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Bildetekst (valgfritt)" style={{fontSize:13}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {photos.map(p=>(
              <div key={p.id} onClick={()=>setLightbox(p)}
                style={{borderRadius:12,background:p.color,aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"1px solid var(--border)"}}>
                <div style={{fontSize:40,marginBottom:6}}>{p.emoji}</div>
                <div style={{fontSize:11,color:"var(--muted)",fontWeight:600}}>{p.by.split(" ")[0]}</div>
                {p.caption&&<div style={{fontSize:10,color:"var(--muted)",marginTop:2,padding:"0 8px",textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%"}}>{p.caption}</div>}
              </div>
            ))}
          </div>
          {lightbox&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setLightbox(null)}>
            <div style={{background:lightbox.color,borderRadius:20,padding:40,textAlign:"center",maxWidth:300}} onClick={e=>e.stopPropagation()}>
              <div style={{fontSize:64,marginBottom:12}}>{lightbox.emoji}</div>
              <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>{lightbox.by}</div>
              {lightbox.caption&&<div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6}}>{lightbox.caption}</div>}
              <button onClick={()=>setLightbox(null)} style={{marginTop:16,padding:"8px 20px",borderRadius:20,border:"1px solid var(--border)",background:"white",cursor:"pointer",fontSize:13}}>Lukk</button>
            </div>
          </div>}
        </div>
      );

      /* ── MUSIC ── */
      case "music": return (
        <div style={wrapStyle}>
          <div style={titleStyle}>Musikk­ønsker</div>
          <div style={{...subStyle}}>Foreslå sanger til dansegulvet!</div>
          <div style={cardStyle()}>
            <div style={labelStyle}>Foreslå en sang</div>
            <div className="inp-wrap"><label className="label">Sangtittel</label><input className="inp" value={songT} onChange={e=>setSongT(e.target.value)} placeholder="f.eks. Can't Stop the Feeling"/></div>
            <div className="inp-wrap"><label className="label">Artist</label><input className="inp" value={songA} onChange={e=>setSongA(e.target.value)} placeholder="f.eks. Justin Timberlake"/></div>
            <button className="btn btn-primary btn-full" onClick={()=>{if(!songT.trim())return;setSongs(s=>[...s,{id:Date.now(),title:songT,artist:songA,by:"Gjest"}]);setSongT("");setSongA("");showToast("Ønske sendt! 🎵");}}>+ Send inn ønske</button>
          </div>
          <div style={cardStyle()}>
            <div style={labelStyle}>Ønskelisten ({songs.length} sanger)</div>
            {songs.map(s=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontSize:18,flexShrink:0}}>🎵</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:500}}>{s.title}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{s.artist} · {s.by}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      /* ── GUESTBOOK ── */
      case "guestbook": return (
        <div style={wrapStyle}>
          <div style={titleStyle}>Gjestebok</div>
          <div style={{...subStyle}}>Skriv en hilsen til brudeparet.</div>
          <div style={cardStyle()}>
            <div className="inp-wrap">
              <textarea className="inp" style={{minHeight:100,resize:"vertical",fontSize:14,lineHeight:1.6}} value={gbMsg} onChange={e=>setGbMsg(e.target.value)} placeholder="Skriv din hjerteligste hilsen her…"/>
            </div>
            <button className="btn btn-primary btn-full" onClick={()=>{if(!gbMsg.trim())return;setEntries(e=>[{id:Date.now(),name:"Gjest",emoji:"✨",msg:gbMsg},...e]);setGbMsg("");setGbSent(true);setTimeout(()=>setGbSent(false),2000);showToast("Hilsen lagt til! ✨");}}>
              {gbSent?"✓ Lagt til!":"Publiser hilsen"}
            </button>
          </div>
          <div style={cardStyle()}>
            <div style={labelStyle}>{entries.length} hilsener</div>
            {entries.map(e=>(
              <div key={e.id} style={{background:"var(--stone)",borderRadius:10,padding:"13px",marginBottom:8}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontSize:20,flexShrink:0}}>{e.emoji}</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"var(--bronze)",marginBottom:4}}>{e.name}</div>
                    <div style={{fontSize:14,lineHeight:1.65}}>{e.msg}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      default: return null;
    }
  };

  /* ══════════════════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════════════════ */
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100dvh",width:"100%",overflow:"hidden",background:"var(--ivory)"}}>
      {/* Hero */}
      <div style={{flexShrink:0,background:"#3A3028",padding:"16px 20px 12px",textAlign:"center",position:"relative"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:"rgba(255,255,255,.35)",marginBottom:4}}>Bryllupsportal</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:500,color:"white",lineHeight:1.1,marginBottom:2}}>{couple}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>{wDay}{wVenue?` · ${wVenue}`:""}</div>
        {daysLeft!==null&&daysLeft>0&&<div style={{fontSize:10,color:"rgba(255,255,255,.25)",marginTop:2}}>{daysLeft} dager igjen</div>}
        <button onClick={onBack} style={{position:"absolute",top:12,right:14,background:"rgba(255,255,255,.1)",border:"none",color:"rgba(255,255,255,.5)",borderRadius:20,padding:"5px 12px",cursor:"pointer",fontSize:11,fontFamily:"'Inter',sans-serif"}}>⇤ Logg ut</button>
      </div>

      {/* Tab nav */}
      <div style={{flexShrink:0,background:"var(--white)",borderBottom:"1px solid var(--border)",overflowX:"auto",scrollbarWidth:"none",display:"flex"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flexShrink:0,padding:"11px 13px",border:"none",background:"transparent",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:11,cursor:"pointer",color:tab===t.id?"var(--bronze)":"var(--muted)",borderBottom:`2px solid ${tab===t.id?"var(--bronze)":"transparent"}`,whiteSpace:"nowrap",transition:"color .15s"}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{flex:1,minHeight:0,overflowY:"auto"}}>
        {renderContent()}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AUTH SCREEN
═══════════════════════════════════════════════════════════ */
function AuthScreen({ users, setUsers, weddings, vendors, onLogin }) {
  const [tab,       setTab]       = useState("login");
  const [username,  setUsername]  = useState("");
  const [password,  setPassword]  = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [regRole,   setRegRole]   = useState("planner");
  const [regName,   setRegName]   = useState("");
  const [regName2,  setRegName2]  = useState("");
  const [regVname,  setRegVname]  = useState("");
  const [regCat,    setRegCat]    = useState("Fotograf");
  const [regCity,   setRegCity]   = useState("");
  const [regEmail,  setRegEmail]  = useState("");
  const [regPhone,  setRegPhone]  = useState("");
  const [inviteCode,setInviteCode]= useState("");
  const [regSuccess,setRegSuccess]= useState(false);

  const VENDOR_CATS = ["Lokale","Fotograf","Video","Catering","Kake","Blomster & dekor","DJ & musikk","Hår & makeup","Kjole & dress","Transport","Koordinator","Annet"];
  const DEMOS = [
    {u:"sophie",     p:"bryllup2025",  r:"Brudeparet"},
    {u:"nordlys",    p:"foto123",      r:"Nordlys Studio"},
    {u:"smakshuset", p:"catering123",  r:"Smakshuset AS"},
    {u:"gjest",      p:"gjest123",     r:"Gjest"},
  ];

  const handleLogin = () => {
    setError("");
    if (!username.trim()||!password.trim()) { setError("Fyll inn brukernavn og passord"); return; }
    setLoading(true);
    setTimeout(() => {
      const user = users.find(u=>u.username.toLowerCase()===username.toLowerCase().trim()&&u.password===password.trim());
      if (user) onLogin(user);
      else { setError("Feil brukernavn eller passord"); setLoading(false); }
    }, 500);
  };

  const genCode = (a,b) => {
    const x=(a||"").replace(/\s/g,"").slice(0,3).toUpperCase();
    const y=(b||"").replace(/\s/g,"").slice(0,3).toUpperCase();
    return (x||"BRY")+(y||"LAP")+Math.floor(Math.random()*900+100);
  };

  const handleRegister = () => {
    setError("");
    if (!username.trim()||!password.trim()||!regName.trim()) { setError("Fyll inn alle obligatoriske felt"); return; }
    if (password.length<6) { setError("Passordet må være minst 6 tegn"); return; }
    if (users.find(u=>u.username.toLowerCase()===username.toLowerCase().trim())) { setError("Brukernavnet er allerede tatt"); return; }
    if (regRole==="vendor"&&!regVname.trim()) { setError("Fyll inn firmanavn"); return; }
    if (regRole==="guest") {
      const code = inviteCode.trim().toUpperCase();
      if (!code) { setError("Skriv inn invitasjonskoden fra brudeparet"); return; }
      const found = Object.keys(weddings||{}).find(wid=>(weddings[wid]?.wedding?.inviteCode||"").toUpperCase()===code);
      if (!found) { setError("Ugyldig invitasjonskode — sjekk med brudeparet"); return; }
    }
    setLoading(true);
    setTimeout(() => {
      const newVendorId = regRole==="vendor" ? "nv_"+Date.now() : null;
      let guestWId = null;
      if (regRole==="guest") {
        const code = inviteCode.trim().toUpperCase();
        guestWId = Object.keys(weddings||{}).find(wid=>(weddings[wid]?.wedding?.inviteCode||"").toUpperCase()===code);
      }
      let newWeddingData = null;
      let newWId = null;
      if (regRole==="planner") {
        newWId = "w_"+Date.now();
        const code = genCode(regName, regName2);
        newWeddingData = {
          id: newWId,
          data: {
            wedding: { id:newWId, inviteCode:code, name1:regName.trim(), name2:regName2.trim()||"",
              display_name:regName2.trim()?regName.trim()+" & "+regName2.trim():regName.trim(),
              date:"", city:"", venue:"", country:"Norge", guest_count:"",
              budget_total:0, wedding_style:"", planning_milestones:[] },
            tasks:[], guests:[], budget:[], vendors:[],
            giftList:[], photoList:[], songList:[],
            guestbookList:[], bookingList:[], contracts:[], vendorChats:{},
          }
        };
      }
      const newUser = {
        id:"u_"+Date.now(), username:username.trim(), password:password.trim(),
        role:regRole, name:regName.trim(),
        weddingId: regRole==="planner"?newWId : guestWId,
        vendorId:newVendorId, vendorName:regRole==="vendor"?regVname.trim():null,
        category:regRole==="vendor"?regCat:null,
        email:regEmail.trim()||null, phone:regPhone.trim()||null, city:regCity.trim()||null,
      };
      setUsers(prev=>[...prev, newUser]);
      if (regRole==="vendor"&&newVendorId) {
        window.__addVendorFromAuth&&window.__addVendorFromAuth({
          id:newVendorId, name:regVname.trim(), category:regCat,
          contact_name:regName.trim(), email:regEmail.trim()||"",
          phone:regPhone.trim()||"", city:regCity.trim()||"",
          website:"", status:"exploring", price_estimate:0, price_actual:0, notes:"", favorite:false,
        });
      }
      setRegSuccess(true); setLoading(false);
      setTimeout(()=>onLogin(newUser, newWeddingData), 1500);
    }, 700);
  };

  if (regSuccess) return (
    <div style={{height:"100dvh",background:"#3A3028",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
      <CSS/>
      <div style={{fontSize:52}}>✓</div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:"white"}}>
        {regRole==="planner"?"Bryllupsprofil opprettet!":regRole==="vendor"?"Leverandørprofil opprettet!":"Konto opprettet!"}
      </div>
      <div style={{fontSize:14,color:"rgba(255,255,255,.45)"}}>Logger deg inn…</div>
    </div>
  );

  return (
    <div style={{height:"100dvh",background:"var(--ivory)",overflowY:"auto",display:"flex",flexDirection:"column"}}>
      <CSS/>
      {/* Brand header */}
      <div style={{background:"linear-gradient(160deg,#3A3028 0%,#5A4030 70%,#7A5840 100%)",padding:"36px 24px 28px",flexShrink:0,textAlign:"center"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:10,letterSpacing:".35em",textTransform:"uppercase",color:"rgba(255,255,255,.35)",marginBottom:10}}>Bryllupsappen</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:34,color:"white",lineHeight:1.1,marginBottom:8}}>Din bryllupsdag,<br/>din historie</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.4)",lineHeight:1.7,maxWidth:300,margin:"0 auto"}}>Planlegg bryllupet, samarbeid med leverandører og inviter gjestene — alt på ett sted.</div>
      </div>

      {/* Form */}
      <div style={{flex:1,padding:"24px 24px 48px",maxWidth:480,width:"100%",alignSelf:"center"}}>
        {/* Tabs */}
        <div style={{display:"flex",background:"var(--stone)",borderRadius:12,padding:3,marginBottom:24}}>
          {["login","register"].map(t=>(
            <button key={t} onClick={()=>{setTab(t);setError("");}}
              style={{flex:1,padding:"10px",borderRadius:10,border:"none",background:tab===t?"var(--white)":"transparent",fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:14,cursor:"pointer",color:tab===t?"var(--text)":"var(--muted)",boxShadow:tab===t?"0 1px 6px rgba(0,0,0,.1)":"none",transition:"all .15s"}}>
              {t==="login"?"Logg inn":"Registrer deg"}
            </button>
          ))}
        </div>

        {tab==="login"&&(
          <>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:"var(--text)",marginBottom:4}}>Velkommen tilbake</div>
            <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>Logg inn med brukernavn og passord</div>
            <div className="inp-wrap">
              <label className="label">Brukernavn</label>
              <input className="inp" value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="ditt brukernavn" style={{fontSize:15,minHeight:48}} autoCapitalize="off" autoCorrect="off"/>
            </div>
            <div className="inp-wrap" style={{position:"relative"}}>
              <label className="label">Passord</label>
              <input className="inp" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••" style={{fontSize:15,minHeight:48,paddingRight:48}}/>
              <button onClick={()=>setShowPw(s=>!s)} style={{position:"absolute",right:12,bottom:12,background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:18}}>{showPw?"🙈":"👁"}</button>
            </div>
            {error&&<div style={{background:"var(--redL)",color:"var(--red)",borderRadius:10,padding:"11px 14px",fontSize:13,marginBottom:14,fontWeight:500}}>{error}</div>}
            <button onClick={handleLogin} disabled={loading}
              style={{width:"100%",padding:"15px",borderRadius:12,border:"none",background:loading?"var(--faint)":"#3A3028",color:"white",fontSize:15,fontWeight:600,fontFamily:"'Inter',sans-serif",cursor:loading?"default":"pointer",marginBottom:16}}>
              {loading?"Logger inn…":"Logg inn →"}
            </button>
            <div style={{textAlign:"center",fontSize:13,color:"var(--muted)",marginBottom:20}}>
              Ny bruker?{" "}<button onClick={()=>setTab("register")} style={{background:"none",border:"none",color:"var(--bronze2)",fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13}}>Registrer deg</button>
            </div>
            <div style={{background:"var(--stone)",borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"var(--muted)",fontWeight:600,marginBottom:10}}>Demo-kontoer</div>
              {DEMOS.map(d=>(
                <button key={d.u} onClick={()=>{setUsername(d.u);setPassword(d.p);}}
                  style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",background:"none",border:"none",borderBottom:"1px solid var(--border)",cursor:"pointer",fontFamily:"'Inter',sans-serif",textAlign:"left"}}>
                  <span style={{fontSize:13,color:"var(--text)",fontWeight:500}}>{d.u} <span style={{color:"var(--muted)",fontWeight:400}}>/ {d.p}</span></span>
                  <span style={{fontSize:11,color:"var(--muted)"}}>{d.r}</span>
                </button>
              ))}
              <div style={{fontSize:11,color:"var(--faint)",marginTop:8,textAlign:"center"}}>Trykk for å fylle inn automatisk</div>
            </div>
          </>
        )}

        {tab==="register"&&(
          <>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:"var(--text)",marginBottom:4}}>Opprett konto</div>
            <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>Hvem er du?</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {[
                {id:"planner",icon:"◈",title:"Brudeparet",sub:"Opprett bryllupsprofil og planlegg alt",color:"#3A3028"},
                {id:"guest",  icon:"◉",title:"Gjest",      sub:"Jeg har fått en invitasjonskode",     color:"#4A7C5C"},
                {id:"vendor", icon:"◎",title:"Leverandør", sub:"Fotograf, catering eller annen tjeneste",color:"#2A4A80"},
              ].map(r=>(
                <button key={r.id} onClick={()=>setRegRole(r.id)}
                  style={{padding:"14px 16px",borderRadius:12,border:`2px solid ${regRole===r.id?r.color:"var(--border)"}`,background:regRole===r.id?"rgba(0,0,0,.03)":"var(--white)",cursor:"pointer",textAlign:"left",fontFamily:"'Inter',sans-serif",transition:"all .15s",display:"flex",gap:14,alignItems:"center"}}>
                  <div style={{width:40,height:40,borderRadius:10,background:regRole===r.id?r.color:"var(--stone)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,transition:"all .15s"}}>
                    <span style={{color:regRole===r.id?"white":"var(--muted)"}}>{r.icon}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,color:regRole===r.id?r.color:"var(--text)"}}>{r.title}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:2,lineHeight:1.4}}>{r.sub}</div>
                  </div>
                  {regRole===r.id&&<span style={{color:r.color,fontSize:18}}>✓</span>}
                </button>
              ))}
            </div>

            {regRole==="planner"&&(
              <div style={{background:"rgba(58,48,40,.04)",borderRadius:12,padding:"16px",marginBottom:14,border:"1px solid var(--border)"}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",marginBottom:12,color:"var(--text)"}}>BRYLLUPSPAR</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><label className="label">Ditt navn *</label><input className="inp" value={regName} onChange={e=>setRegName(e.target.value)} placeholder="Fornavn" style={{fontSize:14}}/></div>
                  <div><label className="label">Partners navn</label><input className="inp" value={regName2} onChange={e=>setRegName2(e.target.value)} placeholder="Fornavn" style={{fontSize:14}}/></div>
                </div>
                <div style={{marginTop:10,padding:"10px 12px",background:"var(--bronzeL)",borderRadius:9,fontSize:12,color:"var(--bronze2)",lineHeight:1.5}}>
                  🔑 Du får en unik invitasjonskode etter registrering som gjestene bruker.
                </div>
              </div>
            )}

            {regRole==="guest"&&(
              <div style={{background:"rgba(74,124,92,.04)",borderRadius:12,padding:"16px",marginBottom:14,border:"1px solid var(--border)"}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",marginBottom:12}}>GJESTEINFORMASJON</div>
                <div className="inp-wrap"><label className="label">Ditt navn *</label><input className="inp" value={regName} onChange={e=>setRegName(e.target.value)} placeholder="Fullt navn" style={{fontSize:14}}/></div>
                <div className="inp-wrap">
                  <label className="label">Invitasjonskode *</label>
                  <input className="inp" value={inviteCode} onChange={e=>setInviteCode(e.target.value.toUpperCase())} placeholder="f.eks. SOPHMAR123" style={{fontSize:16,letterSpacing:".08em",fontFamily:"'Playfair Display',serif"}}/>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>Koden finner du i invitasjonen fra brudeparet</div>
                </div>
              </div>
            )}

            {regRole==="vendor"&&(
              <div style={{background:"rgba(42,74,128,.04)",borderRadius:12,padding:"16px",marginBottom:14,border:"1px solid var(--border)"}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:".08em",marginBottom:12}}>LEVERANDØRINFORMASJON</div>
                <div className="inp-wrap"><label className="label">Ditt navn *</label><input className="inp" value={regName} onChange={e=>setRegName(e.target.value)} placeholder="Kontaktpersonens fulle navn" style={{fontSize:14}}/></div>
                <div className="inp-wrap"><label className="label">Firmanavn *</label><input className="inp" value={regVname} onChange={e=>setRegVname(e.target.value)} placeholder="f.eks. Rosendal Foto AS" style={{fontSize:14}}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                  <div><label className="label">Kategori *</label><select className="inp" value={regCat} onChange={e=>setRegCat(e.target.value)} style={{fontSize:13}}>{VENDOR_CATS.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div><label className="label">By</label><input className="inp" value={regCity} onChange={e=>setRegCity(e.target.value)} placeholder="Oslo" style={{fontSize:13}}/></div>
                </div>
                <div className="inp-wrap"><label className="label">E-post</label><input className="inp" type="email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} placeholder="post@firma.no" style={{fontSize:13}}/></div>
                <div className="inp-wrap"><label className="label">Telefon</label><input className="inp" type="tel" value={regPhone} onChange={e=>setRegPhone(e.target.value)} placeholder="+47 000 00 000" style={{fontSize:13}}/></div>
              </div>
            )}

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:4}}>
              <div><label className="label">Brukernavn *</label><input className="inp" value={username} onChange={e=>setUsername(e.target.value)} placeholder="velg brukernavn" style={{fontSize:14}} autoCapitalize="off" autoCorrect="off"/></div>
              <div style={{position:"relative"}}><label className="label">Passord *</label><input className="inp" type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="min. 6 tegn" style={{fontSize:14,paddingRight:36}}/><button onClick={()=>setShowPw(s=>!s)} style={{position:"absolute",right:10,bottom:10,background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:14}}>{showPw?"🙈":"👁"}</button></div>
            </div>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:16}}>* Obligatoriske felt</div>
            {error&&<div style={{background:"var(--redL)",color:"var(--red)",borderRadius:10,padding:"11px 14px",fontSize:13,marginBottom:14,fontWeight:500}}>{error}</div>}
            <button onClick={handleRegister} disabled={loading}
              style={{width:"100%",padding:"15px",borderRadius:12,border:"none",background:loading?"var(--faint)":"#3A3028",color:"white",fontSize:15,fontWeight:600,fontFamily:"'Inter',sans-serif",cursor:loading?"default":"pointer",marginBottom:12}}>
              {loading?"Oppretter konto…":regRole==="planner"?"Opprett bryllupsprofil →":regRole==="guest"?"Bli med →":"Opprett leverandørprofil →"}
            </button>
            <div style={{textAlign:"center",fontSize:13,color:"var(--muted)"}}>
              Har konto?{" "}<button onClick={()=>setTab("login")} style={{background:"none",border:"none",color:"var(--bronze2)",fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13}}>Logg inn</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


function VendorDashboard({ wedding, vendors, setVendors, chats, setChats, selVendorId, currentUser, showToast, onBack, guests, contracts, setContracts, weddingId }) {
  const vendorFromList = vendors.find(v => v.id===selVendorId);
  const vendor = vendorFromList || (currentUser?.role==="vendor" ? {
    id:currentUser.vendorId, name:currentUser.vendorName||currentUser.name,
    category:currentUser.category||"Annet", contact_name:currentUser.name,
    email:currentUser.email||"", phone:currentUser.phone||"",
    city:currentUser.city||"", website:"", status:"exploring",
    price_estimate:0, price_actual:0, notes:"", favorite:false,
  } : null);

  const [vPage,      setVPage]      = useState("dashboard");
  const [chatMsg,    setChatMsg]    = useState("");
  const [offerSheet, setOfferSheet] = useState(false);
  const [offerDraft, setOfferDraft] = useState({title:"",desc:"",amount:"",validDays:14});
  const [offers,     setOffers]     = useState([
    {id:1,title:"Standardpakke bryllup",amount:38000,desc:"8t fotografering, 300+ bilder, trykt album.",status:"sent",    date:"2025-03-10",couple:wedding?.display_name||"Sophie & Marcus"},
    {id:2,title:"Grunnpakke",            amount:24000,desc:"4t fotografering, 150 bilder, digitalt galleri.",   status:"accepted",date:"2025-02-28",couple:"Emma & Tobias"},
    {id:3,title:"Premiumpakke",          amount:52000,desc:"Hel dag, 500+ bilder, video, to fotografer.",       status:"pending", date:"2025-03-15",couple:"Lena & Mikkel"},
  ]);
  const [invoices, setInvoices] = useState([
    {id:101,couple:wedding?.display_name||"Sophie & Marcus",amount:19000,status:"paid",   due:"2025-02-01",desc:"Depositum 50%"},
    {id:102,couple:"Emma & Tobias",                         amount:24000,status:"paid",   due:"2025-02-15",desc:"Sluttbetaling"},
    {id:103,couple:wedding?.display_name||"Sophie & Marcus",amount:19000,status:"pending",due:"2025-06-01",desc:"Sluttbetaling 50%"},
    {id:104,couple:"Lena & Mikkel",                         amount:26000,status:"overdue",due:"2025-03-01",desc:"Depositum"},
  ]);

  const chatRef = useRef(null);
  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[chats,vPage]);

  if (!vendor) return (
    <div style={{padding:40,textAlign:"center",color:"var(--muted)",fontSize:14,maxWidth:320,margin:"0 auto"}}>
      <div style={{fontSize:36,marginBottom:12}}>🔍</div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"var(--text)",marginBottom:8}}>Ikke tilknyttet et bryllup</div>
      <div style={{fontSize:13,lineHeight:1.6,marginBottom:20}}>Din leverandørprofil er registrert. Brudeparet må legge deg til i sin leverandørliste for at du skal koble deg til dem.</div>
      <button onClick={onBack} className="btn btn-outline btn-sm">← Logg ut</button>
    </div>
  );

  const msgs        = chats[vendor.id] || [];
  const unread      = msgs.filter(m=>m.from==="planner"&&!m.read).length;
  const totalIncome = invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0);
  const pendingInc  = invoices.filter(i=>i.status==="pending").reduce((s,i)=>s+i.amount,0);
  const overdueInc  = invoices.filter(i=>i.status==="overdue").reduce((s,i)=>s+i.amount,0);
  const accOffers   = offers.filter(o=>o.status==="accepted").length;

  const sendMsg = () => {
    if (!chatMsg.trim()) return;
    setChats(c=>({...c,[vendor.id]:[...(c[vendor.id]||[]),{id:Date.now(),from:"vendor",text:chatMsg.trim(),ts:new Date().toLocaleTimeString("nb-NO",{hour:"2-digit",minute:"2-digit"}),read:true}]}));
    setChatMsg("");
    showToast("Melding sendt");
  };

  const sendOffer = () => {
    if (!offerDraft.title||!offerDraft.amount) return;
    const o={...offerDraft,id:Date.now(),status:"sent",date:new Date().toISOString().slice(0,10),couple:wedding?.display_name||"Brudeparet"};
    setOffers(p=>[o,...p]);
    setChats(c=>({...c,[vendor.id]:[...(c[vendor.id]||[]),{id:Date.now()+1,from:"vendor",text:"Vi har sendt deg et tilbud: "+offerDraft.title+" — "+fmtKr(Number(offerDraft.amount||0)),ts:new Date().toLocaleTimeString("nb-NO",{hour:"2-digit",minute:"2-digit"}),read:true}]}));
    setOfferSheet(false);
    setOfferDraft({title:"",desc:"",amount:"",validDays:14});
    showToast("Tilbud sendt ✓");
  };

  const STAG = (s) => {
    const m={sent:["#4A6EA8","#DBEAFE","Sendt"],accepted:["var(--green)","var(--greenL)","Akseptert"],pending:["var(--amber)","var(--amberL)","Venter"],rejected:["var(--red)","var(--redL)","Avslått"],paid:["var(--green)","var(--greenL)","Betalt"],overdue:["var(--red)","var(--redL)","Forfalt"]};
    const [c,b,l]=m[s]||["var(--muted)","var(--stone)",s];
    return <span style={{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:20,background:b,color:c,whiteSpace:"nowrap"}}>{l}</span>;
  };

  const NAV = [
    {id:"dashboard",label:"Oversikt",  icon:"◈"},
    {id:"oppdrag",  label:"Oppdrag",   icon:"◉"},
    {id:"tilbud",   label:"Tilbud",    icon:"◎", badge:offers.filter(o=>o.status==="pending").length},
    {id:"meldinger",label:"Meldinger", icon:"✉", badge:unread},
    {id:"bilder",   label:"Bilder",    icon:"🖼"},
    {id:"kontrakt", label:"Kontrakt",  icon:"✦"},
    {id:"økonomi",  label:"Økonomi",   icon:"◐"},
    {id:"profil",   label:"Profil",    icon:"◫"},
  ];

  // ── CONTENT PAGES ──────────────────────────────────────

  const PageDashboard = () => (
    <div style={{padding:"20px 16px 32px"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:"var(--text)",marginBottom:2}}>
        God dag, {vendor.contact_name||vendor.name}!
      </div>
      {!wedding&&<div style={{background:"var(--amberL)",borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:12,color:"var(--amber)",fontWeight:500}}>
        ⚠ Ingen tilknytning til brudeparet ennå. Be dem legge deg til i sin leverandørliste.
      </div>}
      {wedding&&<div style={{background:"var(--greenL)",borderRadius:10,padding:"8px 14px",marginBottom:12,fontSize:12,color:"var(--green)",fontWeight:500,display:"flex",gap:6,alignItems:"center"}}>
        <span>✓</span> Tilknyttet {wedding.display_name||wedding.name1+" & "+wedding.name2}
      </div>}
      <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>
        {new Date().toLocaleDateString("nb-NO",{weekday:"long",day:"numeric",month:"long"})}
      </div>

      {/* KPI — 2×2 grid on mobile */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[
          {label:"Innbetalt",      val:fmtKr(totalIncome), color:"var(--green)",  sub:"Bekreftet betalt"},
          {label:"Utestående",     val:fmtKr(pendingInc),  color:"var(--amber)",  sub:"Venter betaling"},
          {label:"Forfalt",        val:fmtKr(overdueInc),  color:overdueInc>0?"var(--red)":"var(--muted)", sub:overdueInc>0?"Krever oppfølging":"Ingen"},
          {label:"Tilbud akseptert",val:accOffers+"/"+offers.length, color:"#4A6EA8", sub:"Av totalt sendt"},
        ].map(k=>(
          <div key={k.label} style={{background:"var(--white)",borderRadius:14,border:"1px solid var(--border)",padding:"14px 14px"}}>
            <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:8,lineHeight:1.3}}>{k.label}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:k.color,marginBottom:2}}>{k.val}</div>
            <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.3}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <button onClick={()=>setOfferSheet(true)}
          style={{padding:"16px 12px",borderRadius:14,border:"1.5px solid #4A6EA8",background:"#EEF4FF",cursor:"pointer",textAlign:"left",fontFamily:"'Inter',sans-serif"}}>
          <div style={{fontSize:22,marginBottom:8}}>◎</div>
          <div style={{fontSize:13,fontWeight:600,color:"#2A4A80",marginBottom:2}}>Send tilbud</div>
          <div style={{fontSize:11,color:"#4A6EA8",lineHeight:1.4}}>Til {wedding?.display_name||"brudeparet"}</div>
        </button>
        <button onClick={()=>setVPage("meldinger")}
          style={{padding:"16px 12px",borderRadius:14,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",textAlign:"left",fontFamily:"'Inter',sans-serif",position:"relative"}}>
          <div style={{fontSize:22,marginBottom:8}}>✉</div>
          <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:2}}>Meldinger</div>
          <div style={{fontSize:11,color:"var(--muted)"}}>{msgs.length} totalt{unread>0?" · "+unread+" ulest":""}</div>
          {unread>0&&<span style={{position:"absolute",top:10,right:10,background:"var(--red)",color:"white",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700}}>{unread}</span>}
        </button>
      </div>

      {/* Upcoming wedding */}
      {wedding&&(
        <div style={{background:"linear-gradient(135deg,#1E2A48,#2E3E68)",borderRadius:14,padding:"18px 16px",marginBottom:16}}>
          <div style={{fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.35)",marginBottom:8,fontWeight:600}}>Kommende oppdrag</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"white",marginBottom:4}}>{wedding.display_name||wedding.name1+" & "+wedding.name2}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>{wedding.date?new Date(wedding.date).toLocaleDateString("nb-NO",{day:"numeric",month:"long",year:"numeric"}):""}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.35)",marginTop:2}}>{wedding.city||""}</div>
            </div>
            {wedding.date&&(
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:30,color:"#6A9AE8",lineHeight:1}}>{Math.max(0,Math.floor((new Date(wedding.date)-Date.now())/86400000))}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.35)",marginTop:2}}>dager</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent offers */}
      <div style={{background:"var(--white)",borderRadius:14,border:"1px solid var(--border)"}}>
        <div style={{padding:"13px 16px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:13,fontWeight:600}}>Siste tilbud</div>
          <button onClick={()=>setVPage("tilbud")} style={{fontSize:12,color:"var(--muted)",background:"none",border:"none",cursor:"pointer"}}>Se alle →</button>
        </div>
        {offers.slice(0,3).map(o=>(
          <div key={o.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderBottom:"1px solid var(--border)"}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.title}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{o.couple} · {o.date}</div>
            </div>
            <div style={{fontSize:13,fontWeight:600,flexShrink:0,marginRight:6}}>{fmtKr(o.amount)}</div>
            {STAG(o.status)}
          </div>
        ))}
      </div>

      {offerSheet&&(
        <Sheet title="Nytt tilbud" onClose={()=>setOfferSheet(false)}>
          <div className="inp-wrap"><label className="label">Tittel</label><input className="inp" value={offerDraft.title} onChange={e=>setOfferDraft(d=>({...d,title:e.target.value}))} placeholder="f.eks. Standardpakke bryllup" autoFocus/></div>
          <div className="inp-wrap"><label className="label">Beløp (kr)</label><input className="inp" type="number" value={offerDraft.amount} onChange={e=>setOfferDraft(d=>({...d,amount:e.target.value}))} placeholder="0"/></div>
          <div className="inp-wrap"><label className="label">Beskrivelse / inkludert</label><textarea className="inp" rows={3} value={offerDraft.desc} onChange={e=>setOfferDraft(d=>({...d,desc:e.target.value}))} placeholder="Beskriv hva tilbudet inkluderer…"/></div>
          <div className="inp-wrap"><label className="label">Gyldig i (dager)</label><input className="inp" type="number" value={offerDraft.validDays} onChange={e=>setOfferDraft(d=>({...d,validDays:Number(e.target.value)||14}))} placeholder="14"/></div>
          <button className="btn btn-primary btn-full" onClick={sendOffer}>Send tilbud til {wedding?.display_name||"brudeparet"}</button>
        </Sheet>
      )}
    </div>
  );

  const PageOppdrag = () => (
    <div style={{padding:"20px 16px 32px"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,marginBottom:16}}>Mine oppdrag</div>
      {wedding&&(
        <div style={{background:"var(--white)",borderRadius:14,border:"1px solid var(--border)",overflow:"hidden",marginBottom:12}}>
          <div style={{background:"linear-gradient(135deg,#1E2A48,#2E3E68)",padding:"18px 16px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,color:"white",marginBottom:2}}>{wedding.display_name||wedding.name1+" & "+wedding.name2}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.45)"}}>{wedding.date?new Date(wedding.date).toLocaleDateString("nb-NO",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):""}</div>
          </div>
          <div style={{padding:"14px 16px"}}>
            {[["Sted",wedding.venue||wedding.city||"—"],["Antall gjester",wedding.guest_count||"—"],["Stil",wedding.wedding_style||"—"],["Din kategori",vendor.category],["Status",vendor.status==="booked"?"Bekreftet / Booket":"Under vurdering"],["Estimert",vendor.price_estimate>0?fmtKr(vendor.price_estimate):"—"]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontSize:11,color:"var(--muted)",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase"}}>{l}</span>
                <span style={{fontSize:13,fontWeight:500}}>{v}</span>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button onClick={()=>setVPage("meldinger")} className="btn btn-outline btn-sm" style={{flex:1}}>💬 Melding</button>
              <button onClick={()=>setOfferSheet(true)} className="btn btn-bronze btn-sm" style={{flex:1}}>◎ Tilbud</button>
            </div>
          </div>
        </div>
      )}
      {!wedding&&<div style={{textAlign:"center",padding:"40px 20px",color:"var(--muted)",fontSize:14}}>Ingen oppdrag registrert ennå.</div>}
    </div>
  );

  const PageTilbud = () => (
    <div style={{padding:"20px 16px 32px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22}}>Tilbud</div>
        <button onClick={()=>setOfferSheet(true)} className="btn btn-bronze btn-sm">+ Nytt</button>
      </div>
      {offers.map(o=>(
        <div key={o.id} style={{background:"var(--white)",borderRadius:14,border:"1px solid var(--border)",padding:"14px 16px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
            <div style={{flex:1,minWidth:0,marginRight:8}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,marginBottom:2}}>{o.title}</div>
              <div style={{fontSize:12,color:"var(--muted)"}}>{o.couple} · {o.date}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>{fmtKr(o.amount)}</div>
              {STAG(o.status)}
            </div>
          </div>
          {o.desc&&<div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6,paddingTop:8,borderTop:"1px solid var(--border)"}}>{o.desc}</div>}
        </div>
      ))}
      {offerSheet&&(
        <Sheet title="Nytt tilbud" onClose={()=>setOfferSheet(false)}>
          <div className="inp-wrap"><label className="label">Tittel</label><input className="inp" value={offerDraft.title} onChange={e=>setOfferDraft(d=>({...d,title:e.target.value}))} placeholder="f.eks. Standardpakke" autoFocus/></div>
          <div className="inp-wrap"><label className="label">Beløp (kr)</label><input className="inp" type="number" value={offerDraft.amount} onChange={e=>setOfferDraft(d=>({...d,amount:e.target.value}))} placeholder="0"/></div>
          <div className="inp-wrap"><label className="label">Beskrivelse</label><textarea className="inp" rows={3} value={offerDraft.desc} onChange={e=>setOfferDraft(d=>({...d,desc:e.target.value}))} placeholder="Hva er inkludert…"/></div>
          <div className="inp-wrap"><label className="label">Gyldig (dager)</label><input className="inp" type="number" value={offerDraft.validDays} onChange={e=>setOfferDraft(d=>({...d,validDays:Number(e.target.value)||14}))}/></div>
          <button className="btn btn-primary btn-full" onClick={sendOffer}>Send tilbud</button>
        </Sheet>
      )}
    </div>
  );

  const PageMeldinger = () => (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{flexShrink:0,padding:"14px 16px",borderBottom:"1px solid var(--border)",background:"var(--white)"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:18}}>Chat med {wedding?.display_name||"brudeparet"}</div>
        <div style={{fontSize:12,color:"var(--muted)",marginTop:1}}>{msgs.length} meldinger{unread>0?" · "+unread+" uleste":""}</div>
      </div>
      <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"14px 16px",background:"var(--fog)",display:"flex",flexDirection:"column",gap:8}}>
        {msgs.length===0&&(
          <div style={{textAlign:"center",padding:"32px 16px"}}>
            <div style={{fontSize:32,marginBottom:8}}>💬</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,marginBottom:6}}>Ingen meldinger ennå</div>
            <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6}}>Brudeparet kan kontakte deg via leverandørsiden.</div>
          </div>
        )}
        {msgs.map(m=>{
          const isMe=m.from==="vendor";
          return (
            <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:isMe?"flex-end":"flex-start"}}>
              <div style={{fontSize:10,color:"var(--muted)",marginBottom:3,fontWeight:600}}>{isMe?vendor.contact_name||vendor.name:wedding?.display_name||"Brudeparet"}</div>
              <div style={{maxWidth:"80%",background:isMe?"#1E2A48":"var(--white)",color:isMe?"white":"var(--text)",borderRadius:isMe?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"10px 14px",fontSize:14,lineHeight:1.6,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
                {m.text}
              </div>
              <div style={{fontSize:10,color:"var(--faint)",marginTop:3}}>{m.ts}</div>
            </div>
          );
        })}
      </div>
      <div style={{flexShrink:0,background:"var(--white)",borderTop:"1px solid var(--border)",padding:"10px 12px",display:"flex",gap:8,alignItems:"flex-end"}}>
        <textarea value={chatMsg} onChange={e=>setChatMsg(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg();}}}
          placeholder="Svar til brudeparet…" rows={1}
          style={{flex:1,resize:"none",border:"1.5px solid var(--border)",borderRadius:12,padding:"10px 14px",fontSize:14,fontFamily:"'Inter',sans-serif",outline:"none",lineHeight:1.5,background:"var(--fog)",minHeight:42,maxHeight:100,overflow:"auto"}}/>
        <button onClick={sendMsg} style={{width:42,height:42,borderRadius:12,border:"none",background:chatMsg.trim()?"#1E2A48":"var(--border)",color:"white",cursor:chatMsg.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,transition:"background .15s"}}>↑</button>
      </div>
    </div>
  );

  const PageOkonomi = () => (
    <div style={{padding:"20px 16px 32px"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,marginBottom:16}}>Økonomi</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[["Total omsetning",fmtKr(totalIncome+pendingInc),"var(--text)"],["Innbetalt",fmtKr(totalIncome),"var(--green)"],["Utestående",fmtKr(pendingInc),"var(--amber)"],["Aksepterte tilbud",accOffers+" av "+offers.length,"#4A6EA8"]].map(([l,v,c])=>(
          <div key={l} style={{background:"var(--white)",borderRadius:14,border:"1px solid var(--border)",padding:"16px"}}>
            <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:8,lineHeight:1.3}}>{l}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:c}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{background:"var(--white)",borderRadius:14,border:"1px solid var(--border)"}}>
        <div style={{padding:"13px 16px",borderBottom:"1px solid var(--border)",fontSize:13,fontWeight:600}}>Betalingslogg</div>
        {invoices.map(inv=>(
          <div key={inv.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",borderBottom:"1px solid var(--border)"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:inv.status==="paid"?"var(--green)":inv.status==="overdue"?"var(--red)":"var(--amber)",flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{inv.desc} — {inv.couple}</div>
              {inv.due&&<div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{inv.due}</div>}
            </div>
            <div style={{fontWeight:600,fontSize:13,color:inv.status==="paid"?"var(--green)":inv.status==="overdue"?"var(--red)":"var(--text)",flexShrink:0}}>{fmtKr(inv.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const PageProfil = () => (
    <div style={{padding:"20px 16px 32px"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,marginBottom:16}}>Min profil</div>
      <div style={{background:"var(--white)",borderRadius:14,border:"1px solid var(--border)",padding:"18px 16px",marginBottom:12}}>
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14,paddingBottom:14,borderBottom:"1px solid var(--border)"}}>
          <div style={{width:52,height:52,borderRadius:14,background:"#1E2A48",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:24,color:"white",flexShrink:0}}>{vendor.name[0]}</div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:19}}>{vendor.name}</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{vendor.category}{vendor.city?" · "+vendor.city:""}</div>
          </div>
        </div>
        {currentUser&&(
          <div style={{background:"var(--stone)",borderRadius:9,padding:"9px 12px",marginBottom:12,display:"flex",gap:8,alignItems:"center"}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:"#1E2A48",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"white",fontWeight:700,flexShrink:0}}>{currentUser.name?.[0]}</div>
            <div>
              <div style={{fontSize:12,fontWeight:600}}>{currentUser.name}</div>
              <div style={{fontSize:10,color:"var(--muted)"}}>@{currentUser.username}</div>
            </div>
          </div>
        )}
        {[["Kontakt",vendor.contact_name||"—"],["E-post",vendor.email||"—"],["Telefon",vendor.phone||"—"],["Nettside",vendor.website||"—"],["By",vendor.city||"—"]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
            <span style={{fontSize:11,color:"var(--muted)",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase"}}>{l}</span>
            <span style={{fontSize:13,fontWeight:500,color:v==="—"?"var(--faint)":"var(--text)",textAlign:"right",maxWidth:"60%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</span>
          </div>
        ))}
      </div>
      <button onClick={onBack} style={{width:"100%",padding:"14px",borderRadius:12,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:600,color:"var(--text)",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <span>⇤</span> Logg ut
      </button>
    </div>
  );


  const PageBilder = () => {
    const [portfolio, setPortfolio] = useState(() => {
      // Inherit from catalog vendor if available
      const catV = vendors.find(v => v.id===vendor.id);
      return catV?.portfolio || [];
    });
    const [step,      setStep]      = useState("list");   // list | edit-album | view-album
    const [selAlbum,  setSelAlbum]  = useState(null);
    const [selImg,    setSelImg]    = useState(null);
    const [albumDraft,setAlbumDraft]= useState(null);
    const [newImgCap, setNewImgCap] = useState("");

    const PALETTE = ["#F5EDD8","#EDE4D0","#E8EAF4","#EAF0E0","#F4E8F0","#E8F0F5","#F4EDE8","#EDF4E8","#F5E8F0","#E8EDF5"];
    const EMOJIS  = ["📸","🌸","💍","🥂","💐","✨","🎂","🌿","🎵","👰","🤵","🕯️","🌹","💛","🎊","🍽","🌅","💎","🎭","🌺"];
    const randEl  = (arr) => arr[Math.floor(Math.random()*arr.length)];

    const TAGS = ["Seremoni","Portrett","Detaljer","Lokale","Middag","Dessert","Dekor","Dans","Familie","Reportasje"];

    const newAlbum = () => {
      setAlbumDraft({id:"a_"+Date.now(), title:"", tag:TAGS[0], imgs:[]});
      setStep("edit-album");
    };

    const editAlbum = (a) => {
      setAlbumDraft({...a});
      setStep("edit-album");
    };

    const saveAlbum = () => {
      if (!albumDraft.title.trim()) { showToast("Gi albumet et navn"); return; }
      if (portfolio.find(a=>a.id===albumDraft.id)) {
        setPortfolio(p=>p.map(a=>a.id===albumDraft.id?albumDraft:a));
      } else {
        setPortfolio(p=>[...p,albumDraft]);
      }
      // Also update vendor in vendors list so planner can see
      setVendors(prev=>prev.map(v=>v.id===vendor.id?{...v,portfolio:[...portfolio.filter(a=>a.id!==albumDraft.id),albumDraft]}:v));
      setStep("list");
      setAlbumDraft(null);
      showToast("Album lagret ✓");
    };

    const addFakeImg = () => {
      const img = {c:randEl(PALETTE), e:randEl(EMOJIS), cap:newImgCap.trim()||""};
      setAlbumDraft(d=>({...d, imgs:[...d.imgs, img]}));
      setNewImgCap("");
      showToast("Bilde lagt til 📸");
    };

    const delAlbum = (id) => {
      setPortfolio(p=>p.filter(a=>a.id!==id));
      setVendors(prev=>prev.map(v=>v.id===vendor.id?{...v,portfolio:v.portfolio?.filter(a=>a.id!==id)||[]}:v));
      showToast("Album slettet");
    };

    const totalImgs = portfolio.reduce((s,a)=>s+a.imgs.length,0);

    // Lightbox
    if (selImg) return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.93)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14,padding:24}} onClick={()=>setSelImg(null)}>
        <div style={{borderRadius:20,background:selImg.c,width:"100%",maxWidth:360,aspectRatio:"4/3",display:"flex",alignItems:"center",justifyContent:"center",fontSize:90}}>{selImg.e}</div>
        {selImg.cap&&<div style={{fontSize:14,color:"rgba(255,255,255,.85)",textAlign:"center"}}>{selImg.cap}</div>}
        <div style={{fontSize:12,color:"rgba(255,255,255,.35)"}}>Trykk for å lukke</div>
      </div>
    );

    // Edit album
    if (step==="edit-album"&&albumDraft) return (
      <div style={{padding:"16px 16px 80px"}}>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
          <button onClick={()=>{setStep("list");setAlbumDraft(null);}} style={{background:"var(--stone)",border:"1px solid var(--border)",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,fontWeight:700,color:"var(--text)",flexShrink:0}}>←</button>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18}}>
            {portfolio.find(a=>a.id===albumDraft.id)?"Rediger album":"Nytt album"}
          </div>
        </div>

        <div className="inp-wrap">
          <label className="label">Albumtittel *</label>
          <input className="inp" value={albumDraft.title} onChange={e=>setAlbumDraft(d=>({...d,title:e.target.value}))}
            placeholder="f.eks. Seremoni Oslo 2024" style={{fontSize:15}} autoFocus/>
        </div>
        <div className="inp-wrap">
          <label className="label">Kategori</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {TAGS.map(t=>(
              <button key={t} onClick={()=>setAlbumDraft(d=>({...d,tag:t}))}
                style={{padding:"6px 12px",borderRadius:20,border:`1.5px solid ${albumDraft.tag===t?"var(--bronze)":"var(--border)"}`,background:albumDraft.tag===t?"var(--bronzeL)":"var(--white)",cursor:"pointer",fontSize:11,fontFamily:"'Inter',sans-serif",fontWeight:500,color:albumDraft.tag===t?"var(--bronze2)":"var(--muted)"}}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{marginBottom:14}}>
          <div className="label" style={{marginBottom:8}}>Bilder i albumet ({albumDraft.imgs.length})</div>
          {albumDraft.imgs.length>0&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
              {albumDraft.imgs.map((img,i)=>(
                <div key={i} style={{borderRadius:10,background:img.c,aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",border:"1px solid var(--border)"}}>
                  <div style={{fontSize:32}}>{img.e}</div>
                  {img.cap&&<div style={{fontSize:9,color:"rgba(0,0,0,.5)",marginTop:3,padding:"0 4px",textAlign:"center",lineHeight:1.3}}>{img.cap}</div>}
                  <button onClick={()=>setAlbumDraft(d=>({...d,imgs:d.imgs.filter((_,j)=>j!==i)}))}
                    style={{position:"absolute",top:4,right:4,width:20,height:20,borderRadius:"50%",background:"rgba(0,0,0,.4)",border:"none",color:"white",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>×</button>
                </div>
              ))}
            </div>
          )}

          {/* Add image */}
          <div style={{background:"var(--stone)",borderRadius:12,padding:"14px",border:"2px dashed var(--border)"}}>
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:10,fontWeight:600}}>Legg til bilde</div>
            <input className="inp" value={newImgCap} onChange={e=>setNewImgCap(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&addFakeImg()}
              placeholder="Bildetekst (valgfritt)" style={{fontSize:13,marginBottom:10}}/>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:8}}>I demo-versjonen genereres bilder automatisk. I produksjon: last opp fra kamera.</div>
            <button onClick={addFakeImg} className="btn btn-outline btn-sm" style={{width:"100%"}}>
              📸 Legg til bilde
            </button>
          </div>
        </div>

        <button className="btn btn-primary btn-full mb8" onClick={saveAlbum}>Lagre album</button>
        {portfolio.find(a=>a.id===albumDraft.id)&&(
          <button onClick={()=>{delAlbum(albumDraft.id);setStep("list");setAlbumDraft(null);}}
            style={{width:"100%",padding:"12px",borderRadius:11,border:"1.5px solid var(--red)",background:"var(--redL)",cursor:"pointer",fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600,color:"var(--red)"}}>
            Slett album
          </button>
        )}
      </div>
    );

    // View album
    if (step==="view-album"&&selAlbum) return (
      <div style={{padding:"16px 16px 80px"}}>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
          <button onClick={()=>{setStep("list");setSelAlbum(null);}} style={{background:"var(--stone)",border:"1px solid var(--border)",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,fontWeight:700,color:"var(--text)",flexShrink:0}}>←</button>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18}}>{selAlbum.title}</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:1}}>{selAlbum.imgs.length} bilder · {selAlbum.tag}</div>
          </div>
          <button onClick={()=>editAlbum(selAlbum)} className="btn btn-outline btn-sm">Rediger</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {selAlbum.imgs.map((img,i)=>(
            <div key={i} onClick={()=>setSelImg(img)} style={{borderRadius:12,background:img.c,aspectRatio:"4/3",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",border:"1px solid var(--border)"}}>
              <div style={{fontSize:44,marginBottom:6}}>{img.e}</div>
              {img.cap&&<div style={{fontSize:10,color:"rgba(0,0,0,.5)",padding:"0 8px",textAlign:"center",lineHeight:1.3}}>{img.cap}</div>}
            </div>
          ))}
        </div>
      </div>
    );

    // Portfolio list
    return (
      <div style={{padding:"16px 16px 32px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22}}>Mitt galleri</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{portfolio.length} album · {totalImgs} bilder</div>
          </div>
          <button onClick={newAlbum} className="btn btn-bronze btn-sm">+ Album</button>
        </div>

        <div style={{background:"var(--bronzeL)",borderRadius:10,padding:"11px 14px",marginBottom:16,fontSize:12,color:"var(--bronze2)",lineHeight:1.6}}>
          💡 Albumene er synlige for brudeparet når de vurderer deg som leverandør. Vis frem ditt beste arbeid!
        </div>

        {portfolio.length===0 ? (
          <div style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:48,marginBottom:12}}>📷</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:8}}>Ingen bilder ennå</div>
            <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:20}}>Opprett album med bilder fra tidligere bryllup. Dette er det første brudeparet ser!</div>
            <button onClick={newAlbum} className="btn btn-primary btn-sm">Opprett første album</button>
          </div>
        ) : (
          portfolio.map(album=>(
            <div key={album.id} style={{background:"var(--white)",borderRadius:14,border:"1px solid var(--border)",overflow:"hidden",marginBottom:12,cursor:"pointer"}}
              onClick={()=>{setSelAlbum(album);setStep("view-album");}}>
              {/* Mini grid preview */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",height:80}}>
                {[0,1,2,3].map(i=>(
                  <div key={i} style={{background:album.imgs[i]?.c||"var(--stone)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:i===0?28:20,borderRight:i<3?"1px solid var(--border)":"none",opacity:album.imgs[i]?1:.4}}>
                    {album.imgs[i]?.e||"＋"}
                  </div>
                ))}
              </div>
              <div style={{padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:15,fontWeight:600}}>{album.title}</div>
                  <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{album.imgs.length} bilder</div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:10,background:"var(--bronzeL)",color:"var(--bronze2)",borderRadius:20,padding:"3px 8px",fontWeight:600}}>{album.tag}</span>
                  <button onClick={e=>{e.stopPropagation();editAlbum(album);}} style={{width:28,height:28,borderRadius:8,border:"1px solid var(--border)",background:"var(--stone)",cursor:"pointer",fontSize:12,color:"var(--muted)"}}>✎</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };


  const PageKontrakt = () => {
    const [step,      setStep]      = useState("list");   // list | compose | view
    const [draft,     setDraft]     = useState(null);
    const [selC,      setSelC]      = useState(null);
    const [signSheet, setSignSheet] = useState(false);
    const [signName,  setSignName]  = useState(currentUser?.name||vendor.contact_name||"");
    const [signDate,  setSignDate]  = useState(new Date().toISOString().slice(0,10));

    const myContracts = (contracts||[]).filter(c => c.vendorId===vendor.id);
    const couple = wedding ? `${wedding.name1} & ${wedding.name2}` : "Brudeparet";

    const CLAUSE_TEMPLATES = [
      "Oppdraget annulleres mot skriftlig varsel. Depositum refunderes ikke ved kansellering med mindre enn 30 dager.",
      "Leverandøren forbeholder seg retten til å bruke bilder og innhold til markedsføring, med mindre kunden aktivt reserverer seg.",
      "Kunden er ansvarlig for å oppgi riktig informasjon om dato, sted og antall gjester.",
      "Endringer i oppdraget skal avtales skriftlig og kan medføre tilleggskostnader.",
      "Betaling forfaller senest 14 dager etter mottatt faktura.",
      "Ved force majeure er ingen av partene forpliktet til å oppfylle kontrakten.",
    ];

    const CONTRACT_TEMPLATES = [
      {
        name:"Fotograferingspakke",
        body:`Avtale mellom ${vendor.name} og ${couple} om fotografering i forbindelse med bryllup.\n\nOppdraget omfatter fotografering på bryllupsdagen fra ankomst gjester til avslutning av middag, inkludert seremoni, champagneresepsjon og bryllupsmiddag.\n\nLeverandøren leverer redigerte bilder innen 8 uker etter bryllupsdato via digitalt galleri.`,
        clauses:[CLAUSE_TEMPLATES[0],CLAUSE_TEMPLATES[1],CLAUSE_TEMPLATES[4]],
      },
      {
        name:"Cateringavtale",
        body:`Avtale mellom ${vendor.name} og ${couple} om levering av mat og drikke til bryllup.\n\nOppdraget inkluderer tilberedning og servering av 3-retters middag for antall gjester bekreftet av kunden senest 14 dager før bryllupsdato.\n\nMeny og eventuelle spesialkost avtales minimum 30 dager i forveien.`,
        clauses:[CLAUSE_TEMPLATES[2],CLAUSE_TEMPLATES[3],CLAUSE_TEMPLATES[5]],
      },
      {
        name:"Generell tjenesteavtale",
        body:`Avtale mellom ${vendor.name} og ${couple} om levering av tjenester i forbindelse med bryllup.\n\nPartene har blitt enige om omfang og pris for oppdraget som beskrevet i dette dokumentet.\n\nLeverandøren forplikter seg til å levere avtalte tjenester på avtalt dato og sted med høy faglig kvalitet.`,
        clauses:[CLAUSE_TEMPLATES[0],CLAUSE_TEMPLATES[4]],
      },
    ];

    const NEW_DRAFT = () => ({
      vendorId:    vendor.id,
      vendorName:  vendor.name,
      category:    vendor.category,
      title:       "",
      body:        CONTRACT_TEMPLATES[0].body,
      clauses:     [...CONTRACT_TEMPLATES[0].clauses],
      amount:      vendor.price_estimate>0 ? vendor.price_estimate : 0,
      depositPercent: 50,
      eventDate:   wedding?.date||"",
      venue:       wedding?.venue||wedding?.city||"",
      couple,
      status:      "draft",
      signedByVendor:  false,
      signedByCouple:  false,
      signedVendorName:"",
      signedVendorDate:"",
      signedCoupleName:"",
      signedCoupleDate:"",
    });

    const signAsVendor = () => {
      if (!signName.trim()) { showToast("Fyll inn fullt navn"); return; }
      const updated = {
        ...selC,
        signedByVendor:   true,
        signedVendorName: signName.trim(),
        signedVendorDate: signDate,
        signedVendorAt:   new Date().toISOString(),
        status: selC.signedByCouple ? "completed" : "signed_vendor",
      };
      setContracts(prev=>prev.map(c=>c.id===selC.id?updated:c));
      setSelC(updated);
      setSignSheet(false);
      showToast(selC.signedByCouple?"Kontrakt fullstendig signert! 🎉":"Du har signert ✓");
    };

    const sendContract = () => {
      if (!draft.title.trim()) { showToast("Gi kontrakten en tittel"); return; }
      const toSend = {...draft, id:"c_"+Date.now(), status:"sent", sentAt:new Date().toISOString()};
      setContracts(prev=>[...prev, toSend]);
      setDraft(null);
      setStep("list");
      showToast("Kontrakt sendt til "+couple+" ✓");
    };

    const STATUS = {
      draft:         {l:"Kladd",              c:"var(--muted)", b:"var(--stone)"},
      sent:          {l:"Sendt",              c:"#4A6EA8",      b:"#DBEAFE"},
      signed_couple: {l:"Signert av brudep.", c:"var(--amber)", b:"var(--amberL)"},
      signed_vendor: {l:"Signert av deg",     c:"var(--amber)", b:"var(--amberL)"},
      completed:     {l:"Fullstendig signert",c:"var(--green)", b:"var(--greenL)"},
      rejected:      {l:"Avslått",            c:"var(--red)",   b:"var(--redL)"},
    };
    const stTag = (s) => {
      const st=STATUS[s]||STATUS.draft;
      return <span style={{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:20,background:st.b,color:st.c,whiteSpace:"nowrap"}}>{st.l}</span>;
    };

    if (step==="compose"&&draft) return (
      <div style={{padding:"16px 16px 80px"}}>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
          <button onClick={()=>{setStep("list");setDraft(null);}}
            style={{background:"var(--stone)",border:"1px solid var(--border)",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,fontWeight:700,color:"var(--text)",flexShrink:0}}>←</button>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18}}>Skriv kontrakt</div>
        </div>

        {/* Quick template buttons */}
        <div style={{marginBottom:14}}>
          <div className="label" style={{marginBottom:8}}>Bruk mal</div>
          <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",paddingBottom:4}}>
            {CONTRACT_TEMPLATES.map(t=>(
              <button key={t.name} onClick={()=>setDraft(d=>({...d,body:t.body,clauses:[...t.clauses]}))}
                style={{flexShrink:0,padding:"7px 14px",borderRadius:20,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif",fontWeight:500,color:"var(--text)"}}>
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="inp-wrap">
          <label className="label">Kontraktstitel *</label>
          <input className="inp" value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))}
            placeholder="f.eks. Fotograferingsavtale – Sophie & Marcus" style={{fontSize:14}} autoFocus/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div>
            <label className="label">Kontraktssum (kr)</label>
            <input className="inp" type="number" value={draft.amount||""} onChange={e=>setDraft(d=>({...d,amount:Number(e.target.value)||0}))} placeholder="0" style={{fontSize:14}}/>
          </div>
          <div>
            <label className="label">Depositum (%)</label>
            <input className="inp" type="number" value={draft.depositPercent||""} onChange={e=>setDraft(d=>({...d,depositPercent:Number(e.target.value)||0}))} placeholder="50" style={{fontSize:14}}/>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div>
            <label className="label">Bryllupsdato</label>
            <input className="inp" type="date" value={draft.eventDate||""} onChange={e=>setDraft(d=>({...d,eventDate:e.target.value}))} style={{fontSize:13}}/>
          </div>
          <div>
            <label className="label">Sted / venue</label>
            <input className="inp" value={draft.venue||""} onChange={e=>setDraft(d=>({...d,venue:e.target.value}))} placeholder="Oslo" style={{fontSize:13}}/>
          </div>
        </div>

        <div className="inp-wrap">
          <label className="label">Kontraktstekst</label>
          <textarea className="inp" rows={8} value={draft.body} onChange={e=>setDraft(d=>({...d,body:e.target.value}))}
            style={{fontSize:13,lineHeight:1.7,resize:"vertical"}}/>
        </div>

        <div style={{marginBottom:14}}>
          <label className="label">Vilkår og betingelser</label>
          {draft.clauses.map((cl,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"flex-start"}}>
              <span style={{fontSize:12,color:"var(--muted)",fontWeight:700,paddingTop:10,flexShrink:0,minWidth:20}}>{i+1}.</span>
              <input className="inp" value={cl} onChange={e=>setDraft(d=>({...d,clauses:d.clauses.map((c,j)=>j===i?e.target.value:c)}))} style={{fontSize:12,flex:1}}/>
              <button onClick={()=>setDraft(d=>({...d,clauses:d.clauses.filter((_,j)=>j!==i)}))}
                style={{padding:"8px 10px",borderRadius:8,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:14,color:"var(--muted)",flexShrink:0,marginTop:2}}>✕</button>
            </div>
          ))}
          <button onClick={()=>setDraft(d=>({...d,clauses:[...d.clauses,""]}))}
            style={{padding:"7px 14px",borderRadius:20,border:"1.5px dashed var(--border)",background:"transparent",cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif",color:"var(--muted)",marginTop:4}}>
            + Legg til vilkår
          </button>
        </div>

        {/* Template clause quick-add */}
        <div style={{background:"var(--stone)",borderRadius:10,padding:"12px 14px",marginBottom:16}}>
          <div className="label" style={{marginBottom:8}}>Legg til standard­vilkår</div>
          {CLAUSE_TEMPLATES.map(cl=>(
            <button key={cl} onClick={()=>setDraft(d=>({...d,clauses:[...d.clauses,cl]}))}
              style={{display:"block",width:"100%",textAlign:"left",padding:"8px 10px",marginBottom:4,borderRadius:8,border:"1px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:11,fontFamily:"'Inter',sans-serif",color:"var(--text)",lineHeight:1.5}}>
              + {cl.slice(0,70)}{cl.length>70?"…":""}
            </button>
          ))}
        </div>

        <button className="btn btn-primary btn-full mb8" onClick={sendContract}>
          📄 Send kontrakt til {couple}
        </button>
        <button className="btn btn-outline btn-full" onClick={()=>{setStep("list");setDraft(null);}}>Avbryt</button>
      </div>
    );

    if (step==="view"&&selC) return (
      <div style={{padding:"16px 16px 80px"}}>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
          <button onClick={()=>{setStep("list");setSelC(null);}}
            style={{background:"var(--stone)",border:"1px solid var(--border)",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,fontWeight:700,color:"var(--text)",flexShrink:0}}>←</button>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:17}}>{selC.title}</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:1}}>{selC.sentAt?.slice(0,10)||""}</div>
          </div>
          {stTag(selC.status)}
        </div>

        {/* Signing status */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[
            {l:"Din signatur",    signed:selC.signedByVendor,  name:selC.signedVendorName, date:selC.signedVendorDate},
            {l:"Brudeparets signatur",signed:selC.signedByCouple,name:selC.signedCoupleName,date:selC.signedCoupleDate},
          ].map(p=>(
            <div key={p.l} style={{background:p.signed?"var(--greenL)":"var(--stone)",border:`1.5px solid ${p.signed?"var(--green)":"var(--border)"}`,borderRadius:12,padding:"13px"}}>
              <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",marginBottom:6}}>{p.l}</div>
              {p.signed ? (
                <>
                  <div style={{fontSize:14,fontStyle:"italic",fontFamily:"'Playfair Display',serif",color:"var(--green)",marginBottom:2}}>{p.name}</div>
                  <div style={{fontSize:10,color:"var(--green)"}}>✓ {p.date}</div>
                </>
              ) : (
                <div style={{fontSize:12,color:"var(--muted)"}}>Venter…</div>
              )}
            </div>
          ))}
        </div>

        {selC.amount>0&&(
          <div style={{background:"var(--bronzeL)",borderRadius:12,padding:"13px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:2}}>Kontraktssum</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"var(--bronze2)"}}>{fmtKr(selC.amount)}</div>
            </div>
            {selC.depositPercent>0&&<div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:2}}>Depositum {selC.depositPercent}%</div>
              <div style={{fontSize:14,fontWeight:600,color:"var(--bronze2)"}}>{fmtKr(Math.round(selC.amount*selC.depositPercent/100))}</div>
            </div>}
          </div>
        )}

        <div style={{background:"var(--white)",border:"1px solid var(--border)",borderRadius:14,padding:"18px 16px",marginBottom:14}}>
          <div style={{fontSize:11,color:"var(--muted)",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>Kontraktstekst</div>
          <div style={{fontSize:13,lineHeight:1.85,color:"var(--text)",whiteSpace:"pre-wrap"}}>{selC.body}</div>
          {selC.clauses?.length>0&&(
            <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid var(--border)"}}>
              <div style={{fontSize:11,color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:8}}>Vilkår</div>
              {selC.clauses.map((cl,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{fontSize:11,color:"var(--muted)",fontWeight:700,flexShrink:0}}>{i+1}.</span>
                  <span style={{fontSize:12,color:"var(--text)",lineHeight:1.6}}>{cl}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sign button */}
        {!selC.signedByVendor&&(selC.status==="sent"||selC.status==="signed_couple")&&(
          <button className="btn btn-primary btn-full mb8" onClick={()=>setSignSheet(true)}>
            ✍ Signer som {vendor.contact_name||vendor.name}
          </button>
        )}
        {selC.status==="completed"&&(
          <div style={{background:"var(--greenL)",border:"1px solid var(--green)",borderRadius:12,padding:"14px",textAlign:"center",marginBottom:8}}>
            <div style={{fontSize:22,marginBottom:4}}>🎉</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:"var(--green)"}}>Begge parter har signert</div>
          </div>
        )}

        {signSheet&&(
          <Sheet title="Signer kontrakt" onClose={()=>setSignSheet(false)}>
            <div style={{background:"var(--stone)",borderRadius:10,padding:"11px 14px",marginBottom:14,fontSize:13,lineHeight:1.6}}>
              Signer <strong>{selC.title}</strong> på vegne av <strong>{vendor.name}</strong>. Bindende.
            </div>
            <div className="inp-wrap">
              <label className="label">Fullt navn (signatur)</label>
              <input className="inp" value={signName} onChange={e=>setSignName(e.target.value)}
                placeholder="Skriv fullt navn" style={{fontFamily:"'Playfair Display',serif",fontSize:18,letterSpacing:".02em"}} autoFocus/>
            </div>
            <div className="inp-wrap">
              <label className="label">Dato</label>
              <input className="inp" type="date" value={signDate} onChange={e=>setSignDate(e.target.value)}/>
            </div>
            <div style={{background:"var(--ivory)",border:"1px solid var(--border)",borderRadius:10,padding:"16px",marginBottom:14,minHeight:60,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {signName ? (
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontStyle:"italic",color:"var(--text)"}}>{signName}</div>
              ) : (
                <div style={{fontSize:13,color:"var(--faint)"}}>Signatur vises her</div>
              )}
            </div>
            <button className="btn btn-primary btn-full mb8" onClick={signAsVendor}>Bekreft og signer</button>
            <button className="btn btn-outline btn-full" onClick={()=>setSignSheet(false)}>Avbryt</button>
          </Sheet>
        )}
      </div>
    );

    // LIST VIEW
    const unsigned = myContracts.filter(c=>!c.signedByVendor&&c.status!=="draft"&&c.status!=="rejected").length;
    return (
      <div style={{padding:"16px 16px 32px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22}}>Kontrakter</div>
            {unsigned>0&&<div style={{fontSize:12,color:"var(--amber)",fontWeight:600,marginTop:2}}>⚠ {unsigned} venter på din signatur</div>}
          </div>
          <button onClick={()=>{setDraft(NEW_DRAFT());setStep("compose");}} className="btn btn-bronze btn-sm">+ Ny kontrakt</button>
        </div>

        {myContracts.length===0 ? (
          <div style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:36,marginBottom:12}}>📄</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,marginBottom:6}}>Ingen kontrakter ennå</div>
            <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:20}}>Opprett en kontrakt og send den til {couple} for digital signering.</div>
            <button onClick={()=>{setDraft(NEW_DRAFT());setStep("compose");}} className="btn btn-primary btn-sm">Opprett første kontrakt</button>
          </div>
        ) : myContracts.map(c=>(
          <div key={c.id} onClick={()=>{setSelC(c);setStep("view");}}
            style={{background:"var(--white)",borderRadius:14,border:`1.5px solid ${!c.signedByVendor&&c.status!=="draft"&&c.status!=="rejected"?"var(--amber)":"var(--border)"}`,padding:"14px 16px",marginBottom:10,cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{flex:1,minWidth:0,marginRight:10}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,marginBottom:2}}>{c.title}</div>
                <div style={{fontSize:12,color:"var(--muted)"}}>{c.sentAt?.slice(0,10)||"Kladd"}</div>
              </div>
              {stTag(c.status)}
            </div>
            {c.amount>0&&<div style={{fontSize:13,fontWeight:600,color:"var(--bronze)",marginBottom:8}}>{fmtKr(c.amount)}</div>}
            <div style={{display:"flex",gap:12,fontSize:11}}>
              <span style={{color:c.signedByVendor?"var(--green)":"var(--faint)",fontWeight:600}}>{c.signedByVendor?"✓":"○"} Leverandør</span>
              <span style={{color:c.signedByCouple?"var(--green)":"var(--faint)",fontWeight:600}}>{c.signedByCouple?"✓":"○"} Brudeparet</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Active page rendered via renderPage() below
  const renderPage = () => {
    switch(vPage) {
      case "dashboard":  return <PageDashboard/>;
      case "bilder":     return <PageBilder/>;
      case "oppdrag":    return <PageOppdrag/>;
      case "tilbud":     return <PageTilbud/>;
      case "meldinger":  return <PageMeldinger/>;
      case "kontrakt":   return <PageKontrakt/>;
      case "økonomi":    return <PageOkonomi/>;
      case "profil":     return <PageProfil/>;
      default:           return <PageDashboard/>;
    }
  };
  const isFullH = vPage==="meldinger" || (vPage==="kontrakt");

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100dvh",width:"100%",overflow:"hidden",background:"var(--fog)"}}>

      {/* ── TOP BAR ── */}
      <div style={{flexShrink:0,background:"#1E2A48",padding:"12px 16px",display:"flex",gap:10,alignItems:"center"}}>
        <div style={{width:34,height:34,borderRadius:9,background:"rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:17,color:"white",flexShrink:0}}>{vendor.name[0]}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:600,color:"white",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{vendor.name}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>{vendor.category}{currentUser?" · @"+currentUser.username:""}</div>
        </div>
        <button onClick={onBack}
          style={{padding:"6px 12px",borderRadius:20,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif",fontWeight:500,flexShrink:0,display:"flex",alignItems:"center",gap:5}}>
          <span>⇤</span> Logg ut
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div style={{flex:1,minHeight:0,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <div className={isFullH?"scroll-area full-h":"scroll-area"}>
          {renderPage()}
        </div>
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{flexShrink:0,background:"var(--white)",borderTop:"1px solid var(--border)",display:"flex",overflowX:"auto",scrollbarWidth:"none",paddingBottom:"env(safe-area-inset-bottom,0px)",position:"relative",zIndex:50}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setVPage(n.id)}
            style={{flex:"0 0 auto",minWidth:60,padding:"10px 8px 8px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative",fontFamily:"'Inter',sans-serif",borderTop:`2px solid ${vPage===n.id?"#4A6EA8":"transparent"}`,transition:"border-color .15s"}}>
            <span style={{fontSize:16,color:vPage===n.id?"#4A6EA8":"var(--muted)"}}>{n.icon}</span>
            <span style={{fontSize:10,fontWeight:600,color:vPage===n.id?"#4A6EA8":"var(--muted)",whiteSpace:"nowrap"}}>{n.label}</span>
            {n.badge>0&&<span style={{position:"absolute",top:6,right:6,background:"var(--red)",color:"white",borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>{n.badge}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PLANNER: ØNSKELISTE
═══════════════════════════════════════════════════════════ */
function GiftList({ gifts, setGifts, showToast }) {
  const [sheet, setSheet] = useState(false);
  const [draft, setDraft] = useState({icon:"🎁",name:"",price:0,url:"",notes:""});
  const free  = gifts.filter(g=>!g.takenBy);
  const taken = gifts.filter(g=>g.takenBy);
  const add = () => {
    if (!draft.name.trim()) return;
    setGifts(prev=>[...prev,{...draft,id:Date.now(),takenBy:null}]);
    setDraft({icon:"🎁",name:"",price:0,url:"",notes:""});
    setSheet(false); showToast("Gave lagt til ✓");
  };
  return (
    <div className="page-wrap fade-up">
      <div className="page-header">
        <div className="page-kicker">Deling med gjester</div>
        <div className="h1">Ønskeliste</div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:13,color:"var(--muted)"}}>{free.length} tilgjengelig · {taken.length} valgt</div>
        <button className="btn btn-bronze btn-sm" onClick={()=>setSheet(true)}>+ Legg til</button>
      </div>
      <div className="card-flush">
        {gifts.map(g=>(
          <div key={g.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:"1px solid var(--border)",opacity:g.takenBy?.5:1}}>
            <span style={{fontSize:24,flexShrink:0}}>{g.icon}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:500,textDecoration:g.takenBy?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{g.price.toLocaleString("nb-NO")} kr{g.takenBy?" · Valgt av gjest":""}</div>
            </div>
            {!g.takenBy&&<button className="btn-ghost btn-xs btn" onClick={()=>{setGifts(p=>p.filter(x=>x.id!==g.id));showToast("Fjernet");}}>✕</button>}
          </div>
        ))}
        {gifts.length===0&&<div style={{padding:"32px 16px",textAlign:"center",color:"var(--muted)",fontSize:13}}>Ingen gaver ennå. Legg til ønsker!</div>}
      </div>
      {sheet&&(
        <Sheet title="Ny gave" onClose={()=>setSheet(false)}>
          <div className="inp-wrap"><label className="label">Ikon</label><input className="inp" value={draft.icon} onChange={e=>setDraft(d=>({...d,icon:e.target.value}))} style={{fontSize:22,width:80}}/></div>
          <div className="inp-wrap"><label className="label">Navn *</label><input className="inp" value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} placeholder="f.eks. Le Creuset stekepanne" autoFocus/></div>
          <div className="inp-wrap"><label className="label">Pris (kr)</label><input className="inp" type="number" value={draft.price||""} onChange={e=>setDraft(d=>({...d,price:Number(e.target.value)||0}))}/></div>
          <div className="inp-wrap"><label className="label">Lenke (valgfritt)</label><input className="inp" value={draft.url} onChange={e=>setDraft(d=>({...d,url:e.target.value}))} placeholder="https://"/></div>
          <div className="inp-wrap"><label className="label">Notat</label><textarea className="inp" rows={2} value={draft.notes} onChange={e=>setDraft(d=>({...d,notes:e.target.value}))}/></div>
          <button className="btn btn-primary btn-full" onClick={add}>Legg til gave</button>
        </Sheet>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PLANNER: BILDEDELING
═══════════════════════════════════════════════════════════ */
function PlannerPhotos({ photos, setPhotos, showToast }) {
  const [lightbox, setLightbox] = useState(null);
  const COLORS = ["#f5e8e8","#f0ede4","#e8f0e8","#e8eaf5","#f5f0e8","#e8f0f5"];
  const EMOJIS = ["📸","🌸","🥂","💐","🎵","✨","💍","🎊","🌹","🕯️"];
  const addDemo = () => {
    const p = {id:Date.now(),by:"Brudeparet",emoji:EMOJIS[Math.floor(Math.random()*EMOJIS.length)],color:COLORS[Math.floor(Math.random()*COLORS.length)],caption:"Bryllupsbilder 📸"};
    setPhotos(prev=>[p,...prev]); showToast("Bilde lagt til ✓");
  };
  return (
    <div className="page-wrap fade-up">
      <div className="page-header">
        <div className="page-kicker">Deling med gjester</div>
        <div className="h1">Bildedeling</div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:13,color:"var(--muted)"}}>{photos.length} bilder delt</div>
        <button className="btn btn-bronze btn-sm" onClick={addDemo}>+ Legg til</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {photos.map(p=>(
          <div key={p.id} onClick={()=>setLightbox(p)} style={{borderRadius:12,background:p.color,aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",border:"1px solid var(--border)"}}>
            <div style={{fontSize:40,marginBottom:6}}>{p.emoji}</div>
            <div style={{fontSize:11,color:"var(--muted)",fontWeight:600}}>{(p.by||"").split(" ")[0]}</div>
            {p.caption&&<div style={{fontSize:10,color:"var(--muted)",marginTop:2,padding:"0 8px",textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%"}}>{p.caption}</div>}
          </div>
        ))}
      </div>
      {photos.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"var(--muted)",fontSize:13}}>Ingen bilder ennå. Gjester kan laste opp fra gjesteportalen.</div>}
      {lightbox&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setLightbox(null)}>
        <div style={{background:lightbox.color,borderRadius:20,padding:40,textAlign:"center",maxWidth:300}}>
          <div style={{fontSize:64,marginBottom:12}}>{lightbox.emoji}</div>
          <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>{lightbox.by}</div>
          {lightbox.caption&&<div style={{fontSize:13,color:"var(--muted)"}}>{lightbox.caption}</div>}
          <button onClick={()=>{setPhotos(p=>p.filter(x=>x.id!==lightbox.id));setLightbox(null);showToast("Slettet");}} style={{marginTop:12,padding:"7px 16px",borderRadius:20,border:"1px solid var(--red)",background:"var(--redL)",cursor:"pointer",fontSize:12,color:"var(--red)",fontFamily:"'Inter',sans-serif",fontWeight:600,marginRight:8}}>Slett</button>
          <button onClick={()=>setLightbox(null)} style={{marginTop:12,padding:"7px 16px",borderRadius:20,border:"1px solid var(--border)",background:"white",cursor:"pointer",fontSize:12}}>Lukk</button>
        </div>
      </div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PLANNER: MUSIKK
═══════════════════════════════════════════════════════════ */
function PlannerSongs({ songs, setSongs, showToast }) {
  return (
    <div className="page-wrap fade-up">
      <div className="page-header">
        <div className="page-kicker">Deling med gjester</div>
        <div className="h1">Musikk­ønsker</div>
      </div>
      <div style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>{songs.length} sanger ønsket av gjester</div>
      <div className="card-flush">
        {songs.map((s,i)=>(
          <div key={s.id||i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:"1px solid var(--border)"}}>
            <span style={{fontSize:20}}>🎵</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{s.artist} · {s.by}</div>
            </div>
            <button className="btn btn-ghost btn-xs" onClick={()=>{setSongs(p=>p.filter(x=>(x.id||x.title)!==(s.id||s.title)));showToast("Fjernet");}}>✕</button>
          </div>
        ))}
        {songs.length===0&&<div style={{padding:"32px 16px",textAlign:"center",color:"var(--muted)",fontSize:13}}>Ingen musikk­ønsker ennå. Gjestene kan sende inn fra gjesteportalen.</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PLANNER: GJESTEBOK
═══════════════════════════════════════════════════════════ */
function PlannerGuestbook({ entries, setEntries, showToast }) {
  return (
    <div className="page-wrap fade-up">
      <div className="page-header">
        <div className="page-kicker">Fra gjestene</div>
        <div className="h1">Gjestebok</div>
      </div>
      <div style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>{entries.length} hilsener</div>
      {entries.map((e,i)=>(
        <div key={e.id||i} style={{background:"var(--white)",borderRadius:14,border:"1px solid var(--border)",padding:"14px 16px",marginBottom:10}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:22,flexShrink:0}}>{e.emoji||"✨"}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:"var(--bronze)",marginBottom:4}}>{e.name}</div>
              <div style={{fontSize:14,lineHeight:1.65,color:"var(--text)"}}>{e.msg}</div>
            </div>
            <button className="btn btn-ghost btn-xs" onClick={()=>{setEntries(p=>p.filter(x=>(x.id||x.msg)!==(e.id||e.msg)));showToast("Fjernet");}}>✕</button>
          </div>
        </div>
      ))}
      {entries.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"var(--muted)",fontSize:13}}>Ingen hilsener ennå. Gjestene skriver dem i gjesteportalen.</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PLANNER: BOOKING
═══════════════════════════════════════════════════════════ */
function PlannerBookings({ bookings, setBookings, showToast }) {
  const [sheet, setSheet] = useState(false);
  const [draft, setDraft] = useState({icon:"🎟",name:"",desc:"",price:"Gratis",slots:20});
  const add = () => {
    if (!draft.name.trim()) return;
    setBookings(prev=>[...prev,{...draft,id:"b_"+Date.now(),taken:0,bookedBy:[]}]);
    setDraft({icon:"🎟",name:"",desc:"",price:"Gratis",slots:20});
    setSheet(false); showToast("Booking lagt til ✓");
  };
  return (
    <div className="page-wrap fade-up">
      <div className="page-header">
        <div className="page-kicker">Gjestehåndtering</div>
        <div className="h1">Booking</div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:13,color:"var(--muted)"}}>{bookings.length} tilbud</div>
        <button className="btn btn-bronze btn-sm" onClick={()=>setSheet(true)}>+ Legg til</button>
      </div>
      {bookings.map(b=>{
        const pct = Math.round(b.taken/Math.max(b.slots,1)*100);
        return (
          <div key={b.id} style={{background:"var(--white)",borderRadius:14,border:"1px solid var(--border)",padding:"14px 16px",marginBottom:10}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:8}}>
              <span style={{fontSize:26,flexShrink:0}}>{b.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,marginBottom:2}}>{b.name}</div>
                <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5,marginBottom:4}}>{b.desc}</div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:600,color:"var(--bronze)"}}>{b.price}</span>
                  <span style={{fontSize:11,color:"var(--muted)"}}>{b.taken}/{b.slots} påmeldt</span>
                </div>
              </div>
            </div>
            <div style={{height:4,background:"var(--border)",borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:pct+"%",background:pct>80?"var(--red)":"var(--sage)",borderRadius:2,transition:"width .4s"}}/>
            </div>
          </div>
        );
      })}
      {bookings.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"var(--muted)",fontSize:13}}>Ingen bookingalternativer ennå.</div>}
      {sheet&&(
        <Sheet title="Nytt bookingtilbud" onClose={()=>setSheet(false)}>
          <div className="inp-wrap"><label className="label">Ikon</label><input className="inp" value={draft.icon} onChange={e=>setDraft(d=>({...d,icon:e.target.value}))} style={{fontSize:22,width:80}}/></div>
          <div className="inp-wrap"><label className="label">Navn *</label><input className="inp" value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} placeholder="f.eks. Shuttlebuss" autoFocus/></div>
          <div className="inp-wrap"><label className="label">Beskrivelse</label><textarea className="inp" rows={2} value={draft.desc} onChange={e=>setDraft(d=>({...d,desc:e.target.value}))}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            <div><label className="label">Pris</label><input className="inp" value={draft.price} onChange={e=>setDraft(d=>({...d,price:e.target.value}))} placeholder="Gratis"/></div>
            <div><label className="label">Maks plasser</label><input className="inp" type="number" value={draft.slots} onChange={e=>setDraft(d=>({...d,slots:Number(e.target.value)||20}))}/></div>
          </div>
          <button className="btn btn-primary btn-full" onClick={add}>Opprett booking</button>
        </Sheet>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   PLANNER: KONTRAKTER — se, godkjenn og signer
═══════════════════════════════════════════════════════════ */
function PlannerContracts({ contracts, setContracts, wedding, currentUser, showToast }) {
  const [sel,       setSel]       = useState(null);
  const [signSheet, setSignSheet] = useState(false);
  const [signName,  setSignName]  = useState(currentUser?.name || "");
  const [signDate,  setSignDate]  = useState(new Date().toISOString().slice(0,10));
  const [preview,   setPreview]   = useState(false);

  const couple = wedding ? `${wedding.name1} & ${wedding.name2}` : "Brudeparet";

  const STATUS = {
    draft:          {l:"Kladd",             c:"var(--muted)",  b:"var(--stone)"},
    sent:           {l:"Til signering",      c:"#4A6EA8",       b:"#DBEAFE"},
    signed_couple:  {l:"Signert av dere",    c:"var(--amber)",  b:"var(--amberL)"},
    signed_vendor:  {l:"Signert av lev.",    c:"var(--amber)",  b:"var(--amberL)"},
    completed:      {l:"Fullstendig signert",c:"var(--green)",  b:"var(--greenL)"},
    rejected:       {l:"Avslått",            c:"var(--red)",    b:"var(--redL)"},
  };

  const stTag = (s) => {
    const st = STATUS[s]||STATUS.draft;
    return <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:st.b,color:st.c}}>{st.l}</span>;
  };

  const signContract = () => {
    if (!signName.trim()) { showToast("Fyll inn fullt navn"); return; }
    setContracts(prev => prev.map(c => {
      if (c.id !== sel.id) return c;
      const wasSignedVendor = c.status === "signed_vendor";
      return {
        ...c,
        signedByCouple: true,
        signedCoupleAt: new Date().toISOString(),
        signedCoupleName: signName.trim(),
        signedCoupleDate: signDate,
        status: wasSignedVendor ? "completed" : "signed_couple",
      };
    }));
    setSel(prev => ({...prev, signedByCouple:true, signedCoupleName:signName.trim(), status: sel.status==="signed_vendor"?"completed":"signed_couple"}));
    setSignSheet(false);
    showToast(sel.status==="signed_vendor" ? "Kontrakt fullstendig signert! 🎉" : "Du har signert kontrakten ✓");
  };

  const rejectContract = (id) => {
    setContracts(prev => prev.map(c => c.id===id ? {...c,status:"rejected"} : c));
    setSel(null);
    showToast("Kontrakt avslått");
  };

  const incoming = contracts.filter(c => c.status !== "draft");
  const unsign   = contracts.filter(c => c.status==="sent"||c.status==="signed_vendor").length;

  if (sel) return (
    <div className="fade-up">
      <div className="page-wrap">
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16,marginTop:8}}>
          <button onClick={()=>setSel(null)} style={{background:"var(--stone)",border:"1px solid var(--border)",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,fontWeight:700,color:"var(--text)",flexShrink:0}}>←</button>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"var(--text)"}}>{sel.title}</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:1}}>{sel.vendorName} · {sel.sentAt?.slice(0,10)||""}</div>
          </div>
          {stTag(sel.status)}
        </div>

        {/* Parties */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {[
            {label:"Leverandør",   name:sel.vendorName,  signed:sel.signedByVendor,  date:sel.signedVendorDate,  sigName:sel.signedVendorName},
            {label:"Brudeparet",   name:couple,          signed:sel.signedByCouple,  date:sel.signedCoupleDate,  sigName:sel.signedCoupleName},
          ].map(p=>(
            <div key={p.label} style={{background:p.signed?"var(--greenL)":"var(--stone)",border:`1.5px solid ${p.signed?"var(--green)":"var(--border)"}`,borderRadius:12,padding:"14px"}}>
              <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:6}}>{p.label}</div>
              <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:p.signed?8:0}}>{p.name}</div>
              {p.signed ? (
                <>
                  <div style={{fontSize:12,fontStyle:"italic",fontFamily:"'Playfair Display',serif",color:"var(--green)",marginBottom:3}}>{p.sigName}</div>
                  <div style={{fontSize:10,color:"var(--green)"}}>✓ Signert {p.date}</div>
                </>
              ) : (
                <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>Venter på signering</div>
              )}
            </div>
          ))}
        </div>

        {/* Amount */}
        {sel.amount>0&&(
          <div style={{background:"var(--bronzeL)",border:"1px solid rgba(184,149,106,.2)",borderRadius:12,padding:"14px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:2}}>Kontraktssum</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:"var(--bronze2)"}}>{fmtKr(sel.amount)}</div>
            </div>
            {sel.depositPercent>0&&<div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:"var(--muted)",marginBottom:2}}>Depositum {sel.depositPercent}%</div>
              <div style={{fontSize:15,fontWeight:600,color:"var(--bronze2)"}}>{fmtKr(Math.round(sel.amount*sel.depositPercent/100))}</div>
            </div>}
          </div>
        )}

        {/* Contract body */}
        <div style={{background:"var(--white)",border:"1px solid var(--border)",borderRadius:14,padding:"20px 18px",marginBottom:16}}>
          <div style={{fontSize:11,color:"var(--muted)",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:14}}>Kontraktstekst</div>
          <div style={{fontSize:14,lineHeight:1.85,color:"var(--text)",whiteSpace:"pre-wrap"}}>{sel.body}</div>
          {sel.clauses?.length>0&&(
            <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--border)"}}>
              <div style={{fontSize:11,color:"var(--muted)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:10}}>Vilkår og betingelser</div>
              {sel.clauses.map((cl,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{fontSize:12,color:"var(--muted)",fontWeight:700,flexShrink:0,minWidth:20}}>{i+1}.</span>
                  <span style={{fontSize:13,color:"var(--text)",lineHeight:1.6}}>{cl}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {(sel.status==="sent"||sel.status==="signed_vendor")&&!sel.signedByCouple&&(
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-primary btn-full" onClick={()=>setSignSheet(true)} style={{flex:2}}>
              ✍ Signer kontrakt
            </button>
            <button onClick={()=>rejectContract(sel.id)}
              style={{flex:1,padding:"12px",borderRadius:11,border:"1.5px solid var(--red)",background:"var(--redL)",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'Inter',sans-serif",color:"var(--red)"}}>
              Avslå
            </button>
          </div>
        )}
        {sel.status==="completed"&&(
          <div style={{background:"var(--greenL)",border:"1px solid var(--green)",borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
            <div style={{fontSize:16,marginBottom:4}}>🎉</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:"var(--green)"}}>Kontrakt fullstendig signert av begge parter</div>
          </div>
        )}
      </div>

      {signSheet&&(
        <Sheet title="Signer kontrakt" onClose={()=>setSignSheet(false)}>
          <div style={{background:"var(--stone)",borderRadius:10,padding:"12px 14px",marginBottom:14,fontSize:13,lineHeight:1.6,color:"var(--text)"}}>
            Du er i ferd med å signere <strong>{sel.title}</strong> med <strong>{sel.vendorName}</strong>.
            Dette er bindende.
          </div>
          <div className="inp-wrap">
            <label className="label">Fullt navn (signatur)</label>
            <input className="inp" value={signName} onChange={e=>setSignName(e.target.value)}
              placeholder="Skriv fullt navn" style={{fontFamily:"'Playfair Display',serif",fontSize:18,letterSpacing:".02em"}} autoFocus/>
          </div>
          <div className="inp-wrap">
            <label className="label">Dato</label>
            <input className="inp" type="date" value={signDate} onChange={e=>setSignDate(e.target.value)}/>
          </div>
          <div style={{background:"var(--ivory)",border:"1px solid var(--border)",borderRadius:10,padding:"16px",marginBottom:14,minHeight:60,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {signName ? (
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontStyle:"italic",color:"var(--text)",letterSpacing:".02em"}}>{signName}</div>
            ) : (
              <div style={{fontSize:13,color:"var(--faint)"}}>Signatur vises her</div>
            )}
          </div>
          <button className="btn btn-primary btn-full mb8" onClick={signContract}>Bekreft og signer</button>
          <button className="btn btn-outline btn-full" onClick={()=>setSignSheet(false)}>Avbryt</button>
        </Sheet>
      )}
    </div>
  );

  return (
    <div className="fade-up">
      <div className="page-wrap">
        <div className="page-header">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div>
              <div className="page-kicker">Leverandørkontrakter</div>
              <div className="h1">Kontrakter</div>
              {unsign>0&&<div style={{fontSize:13,color:"var(--amber)",fontWeight:600,marginTop:4}}>⚠ {unsign} venter på din signatur</div>}
            </div>
          </div>
        </div>

        {incoming.length===0 ? (
          <EmptyState title="Ingen kontrakter ennå" sub="Leverandørene sender kontraktsforslag herfra. Du vil se dem her til signering." cta={null}/>
        ) : (
          incoming.map(c=>(
            <div key={c.id} onClick={()=>setSel(c)}
              style={{background:"var(--white)",borderRadius:14,border:`1.5px solid ${c.status==="sent"||c.status==="signed_vendor"?"var(--amber)":"var(--border)"}`,padding:"16px",marginBottom:10,cursor:"pointer",transition:"box-shadow .15s"}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.06)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{flex:1,minWidth:0,marginRight:10}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:"var(--text)",marginBottom:2}}>{c.title}</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>{c.vendorName} · {c.sentAt?.slice(0,10)||""}</div>
                </div>
                {stTag(c.status)}
              </div>
              {c.amount>0&&<div style={{fontSize:14,fontWeight:600,color:"var(--bronze)",marginBottom:8}}>{fmtKr(c.amount)}</div>}
              <div style={{display:"flex",gap:12,fontSize:11}}>
                <span style={{color:c.signedByVendor?"var(--green)":"var(--faint)",fontWeight:600}}>{c.signedByVendor?"✓":"○"} Leverandør</span>
                <span style={{color:c.signedByCouple?"var(--green)":"var(--faint)",fontWeight:600}}>{c.signedByCouple?"✓":"○"} Brudeparet</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


function Settings({ wedding, setWedding, showToast, resetAll, inviteCode }) {
  const [w, setW] = useState({...wedding});
  const set = k => e => setW(x=>({...x,[k]:e.target.value}));
  const save = () => { setWedding(w); showToast("Innstillinger lagret"); };

  return (
    <div className="page-wrap fade-up">
      <div className="page-header">
        <div className="page-kicker">Innstillinger</div>
        <div className="h1">Bryllupsinnstillinger</div>
      </div>

      {inviteCode&&(
        <div style={{background:"#3A3028",borderRadius:14,padding:"18px 16px",marginBottom:12}}>
          <div style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,.35)",marginBottom:8,fontWeight:600}}>Din invitasjonskode</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:34,letterSpacing:".14em",color:"var(--bronze)",marginBottom:8}}>{inviteCode}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.45)",lineHeight:1.6,marginBottom:12}}>Del denne koden med gjestene dine. De skriver den inn ved registrering for å koble seg til bryllupet ditt.</div>
          <button onClick={()=>{navigator.clipboard?.writeText(inviteCode).then(()=>showToast("Kode kopiert ✓"));}}
            style={{padding:"8px 16px",borderRadius:20,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.1)",color:"white",cursor:"pointer",fontSize:12,fontFamily:"'Inter',sans-serif",fontWeight:600}}>
            Kopier kode
          </button>
        </div>
      )}

      <div className="card">
        <div className="inp-wrap"><label className="label">Navn 1</label><input className="inp" value={w.name1||""} onChange={set("name1")}/></div>
        <div className="inp-wrap"><label className="label">Navn 2</label><input className="inp" value={w.name2||""} onChange={set("name2")}/></div>
        <div className="inp-wrap"><label className="label">Visningsnavn</label><input className="inp" value={w.display_name||""} onChange={set("display_name")}/></div>
        <div className="inp-wrap"><label className="label">Bryllupsdato</label><input className="inp" type="date" value={w.date||""} onChange={set("date")}/></div>
        <div className="inp-wrap"><label className="label">By</label><input className="inp" value={w.city||""} onChange={set("city")}/></div>
        <div className="inp-wrap"><label className="label">Land</label><input className="inp" value={w.country||""} onChange={set("country")}/></div>
        <div className="inp-wrap"><label className="label">Totalbudsjett (kr)</label><input className="inp" type="number" value={w.budget_total||""} onChange={set("budget_total")}/></div>
        <button className="btn btn-primary btn-full mt8" onClick={save}>Lagre endringer</button>
      </div>

      <div className="card" style={{border:"1px solid var(--redL)"}}>
        <div className="h3 mb8" style={{color:"var(--red)"}}>Faresone</div>
        <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:14}}>Nullstiller all bryllupsdata og starter på nytt. Dette kan ikke angres.</div>
        <button className="btn btn-full" style={{background:"var(--red)",color:"white"}} onClick={()=>{ if(window.confirm("Er du sikker? All data slettes permanent.")) resetAll(); }}>Nullstill alt og start på nytt</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */

/* Memoized sidebar */
const NAV_PLANNER = [
  {id:"home",     label:"Hjem",         icon:"◈"},
  {id:"tasks",    label:"Plan",          icon:"✦"},
  {id:"guests",   label:"Gjester",       icon:"◉"},
  {id:"vendors",  label:"Leverandører",  icon:"◎"},
  {id:"budget",   label:"Budsjett",      icon:"◷"},
  {id:"seating",  label:"Bordplan",      icon:"⊞"},
  {id:"ai",       label:"AI-assistent",  icon:"✧"},
  {id:"settings", label:"Innstillinger", icon:"◐"},
];

const Sidebar = React.memo(function Sidebar({ page, setPage, wedding, tasks, saveStatus, mode, setMode }) {
  const doneTasks = tasks.filter(t=>t.status==="done").length;
  const urgentOpen = tasks.filter(t=>t.status!=="done"&&t.status!=="cancelled"&&t.priority==="critical").length;
  return (
    <nav className="sidebar">
      <div className="sb-logo">
        <div className="sb-logo-mark">Bryllupsappen</div>
        <div className="sb-logo-name">{wedding?.display_name||"Ditt bryllup"}</div>
      </div>
      <div style={{padding:"12px 24px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
        <div style={{display:"flex",background:"rgba(255,255,255,.08)",borderRadius:20,padding:2}}>
          <button onClick={()=>setMode("planner")} style={{flex:1,padding:"7px 8px",borderRadius:18,border:"none",background:mode==="planner"?"var(--ivory)":"transparent",color:mode==="planner"?"var(--text)":"rgba(255,255,255,.4)",fontSize:10,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,transition:"all .15s"}}>Planner</button>
          <button onClick={()=>setMode("guest")}   style={{flex:1,padding:"7px 8px",borderRadius:18,border:"none",background:mode==="guest"?"var(--bronze)":"transparent",color:mode==="guest"?"white":"rgba(255,255,255,.4)",fontSize:10,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,transition:"all .15s"}}>Gjest</button>
          <button onClick={()=>setMode("vendor")}  style={{flex:1,padding:"7px 8px",borderRadius:18,border:"none",background:mode==="vendor"?"#5A4A80":"transparent",color:mode==="vendor"?"white":"rgba(255,255,255,.4)",fontSize:10,cursor:"pointer",fontFamily:"'Inter',sans-serif",fontWeight:600,transition:"all .15s"}}>Lev.</button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:8}}>
        {mode==="guest" ? (
          /* Guest portal nav in sidebar */
          <>
            <div className="sb-section">Gjesteportal</div>
            {[
              {id:"invitation", label:"Invitasjon",    icon:"✉"},
              {id:"program",    label:"Program",        icon:"▤"},
              {id:"menu",       label:"Meny",           icon:"◉"},
              {id:"practical",  label:"Praktisk info",  icon:"◷"},
              {id:"rsvp",       label:"Svar på RSVP",   icon:"✦"},
              {id:"booking",    label:"Booking",        icon:"◎"},
              {id:"gifts",      label:"Ønskeliste",     icon:"◇"},
              {id:"photos",     label:"Bildedeling",    icon:"◫"},
              {id:"music",      label:"Musikk­ønsker",   icon:"♪"},
              {id:"guestbook",  label:"Gjestebok",      icon:"✐"},
            ].map(n=>(
              <div key={n.id} className="sb-item" onClick={()=>{
                window.dispatchEvent(new CustomEvent("guestTab",{detail:n.id}));
              }}>
                <span className="sb-item-icon">{n.icon}</span>
                <span>{n.label}</span>
              </div>
            ))}
          </>
        ) : (
          /* Planner nav */
          NAV_PLANNER.map(n=>(
            <div key={n.id} className={`sb-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
              <span className="sb-item-icon">{n.icon}</span>
              <span>{n.label}</span>
              {n.id==="tasks"&&urgentOpen>0&&<span className="sb-badge">{urgentOpen}</span>}
            </div>
          ))
        )}
      </div>
      <div className="sb-footer">
        <div className="sb-avatar">{wedding?.name1?.[0]||"?"}</div>
        <div>
          <div className="sb-user-name">{wedding?.name1||"Bruker"}</div>
          <div className="sb-user-role" style={{color:saveStatus==="saving"?"rgba(255,255,255,.4)":"rgba(100,200,120,.7)"}}>
            {saveStatus==="saving" ? "Lagrer..." : "● Lagret"}
          </div>
        </div>
      </div>
    </nav>
  );
});

/* Mobile bottom nav — only 5 items */
const BOTTOM_NAV = [
  {id:"home",    label:"Hjem",    icon:"◈"},
  {id:"tasks",   label:"Plan",    icon:"✦"},
  {id:"guests",  label:"Gjester", icon:"◉"},
  {id:"vendors", label:"Marked",  icon:"◎"},
  {id:"more",    label:"Mer",     icon:"···"},
];

const DEMO_GUESTS = [
  {id:1,  first_name:"Marte",    last_name:"Haugen",   email:"marte@epost.no",    phone:"91234567", relation_category:"Familie",   side_of_couple:"brudgom", rsvp_status:"accepted", allergies:"",        plus_one_allowed:false, plus_one_name:"",         notes:"Brudgommens søster"},
  {id:2,  first_name:"Lars",     last_name:"Haugen",   email:"lars@epost.no",     phone:"92345678", relation_category:"Familie",   side_of_couple:"brudgom", rsvp_status:"accepted", allergies:"",        plus_one_allowed:true,  plus_one_name:"Kari Dahl",notes:"Brudgommens bror"},
  {id:3,  first_name:"Ingrid",   last_name:"Berg",     email:"ingrid@epost.no",   phone:"93456789", relation_category:"Familie",   side_of_couple:"brud",    rsvp_status:"accepted", allergies:"Nøtter",  plus_one_allowed:true,  plus_one_name:"",         notes:"Brudens tante"},
  {id:4,  first_name:"Tor",      last_name:"Berg",     email:"tor@epost.no",      phone:"94567890", relation_category:"Familie",   side_of_couple:"brud",    rsvp_status:"accepted", allergies:"",        plus_one_allowed:false, plus_one_name:"",         notes:"Brudens onkel"},
  {id:5,  first_name:"Emma",     last_name:"Lie",      email:"emma@epost.no",     phone:"95678901", relation_category:"Venner",    side_of_couple:"brud",    rsvp_status:"accepted", allergies:"Gluten",  plus_one_allowed:true,  plus_one_name:"Henrik Moe",notes:"Brudens bestevenn"},
  {id:6,  first_name:"Jonas",    last_name:"Strand",   email:"jonas@epost.no",    phone:"96789012", relation_category:"Venner",    side_of_couple:"felles",  rsvp_status:"accepted", allergies:"",        plus_one_allowed:true,  plus_one_name:"Lise Strand",notes:""},
  {id:7,  first_name:"Nora",     last_name:"Dahl",     email:"nora@epost.no",     phone:"97890123", relation_category:"Venner",    side_of_couple:"brud",    rsvp_status:"accepted", allergies:"Laktose", plus_one_allowed:false, plus_one_name:"",         notes:"Forlover"},
  {id:8,  first_name:"Petter",   last_name:"Holm",     email:"petter@epost.no",   phone:"98901234", relation_category:"Venner",    side_of_couple:"brudgom", rsvp_status:"accepted", allergies:"",        plus_one_allowed:true,  plus_one_name:"",         notes:"Toastmaster"},
  {id:9,  first_name:"Silje",    last_name:"Andersen", email:"silje@epost.no",    phone:"99012345", relation_category:"Venner",    side_of_couple:"felles",  rsvp_status:"pending",  allergies:"",        plus_one_allowed:false, plus_one_name:"",         notes:""},
  {id:10, first_name:"Kristian", last_name:"Olsen",    email:"kristian@epost.no", phone:"90123456", relation_category:"Venner",    side_of_couple:"brudgom", rsvp_status:"pending",  allergies:"",        plus_one_allowed:true,  plus_one_name:"",         notes:""},
  {id:11, first_name:"Anne",     last_name:"Eriksen",  email:"anne@epost.no",     phone:"91122334", relation_category:"Familie",   side_of_couple:"brudgom", rsvp_status:"accepted", allergies:"Skalldyr",plus_one_allowed:false, plus_one_name:"",         notes:"Mor til brudgom"},
  {id:12, first_name:"Bjørn",    last_name:"Eriksen",  email:"bjorn@epost.no",    phone:"92233445", relation_category:"Familie",   side_of_couple:"brudgom", rsvp_status:"accepted", allergies:"",        plus_one_allowed:false, plus_one_name:"",         notes:"Far til brudgom"},
  {id:13, first_name:"Lena",     last_name:"Sørensen", email:"lena@epost.no",     phone:"93344556", relation_category:"Familie",   side_of_couple:"brud",    rsvp_status:"accepted", allergies:"",        plus_one_allowed:false, plus_one_name:"",         notes:"Mor til brud"},
  {id:14, first_name:"Henrik",   last_name:"Sørensen", email:"henrik@epost.no",   phone:"94455667", relation_category:"Familie",   side_of_couple:"brud",    rsvp_status:"accepted", allergies:"",        plus_one_allowed:false, plus_one_name:"",         notes:"Far til brud"},
  {id:15, first_name:"Thea",     last_name:"Nilsen",   email:"thea@epost.no",     phone:"95566778", relation_category:"Venner",    side_of_couple:"felles",  rsvp_status:"accepted", allergies:"",        plus_one_allowed:true,  plus_one_name:"Ole Nilsen",notes:""},
  {id:16, first_name:"Camilla",  last_name:"Rød",      email:"camilla@epost.no",  phone:"96677889", relation_category:"Kollegaer", side_of_couple:"brud",    rsvp_status:"accepted", allergies:"Egg",     plus_one_allowed:false, plus_one_name:"",         notes:"Sophies kollega"},
  {id:17, first_name:"Martin",   last_name:"Gran",     email:"martin@epost.no",   phone:"97788990", relation_category:"Kollegaer", side_of_couple:"brudgom", rsvp_status:"declined", allergies:"",        plus_one_allowed:false, plus_one_name:"",         notes:"Reiser til utlandet"},
  {id:18, first_name:"Ida",      last_name:"Bakken",   email:"ida@epost.no",      phone:"98899001", relation_category:"Venner",    side_of_couple:"felles",  rsvp_status:"accepted", allergies:"Nøtter",  plus_one_allowed:true,  plus_one_name:"",         notes:""},
  {id:19, first_name:"Magnus",   last_name:"Vold",     email:"magnus@epost.no",   phone:"99900112", relation_category:"Familie",   side_of_couple:"brudgom", rsvp_status:"pending",  allergies:"",        plus_one_allowed:true,  plus_one_name:"",         notes:"Fetter"},
  {id:20, first_name:"Sara",     last_name:"Toft",     email:"sara@epost.no",     phone:"90011223", relation_category:"Venner",    side_of_couple:"felles",  rsvp_status:"accepted", allergies:"",        plus_one_allowed:false, plus_one_name:"",         notes:""},
  {id:21, first_name:"Ola",      last_name:"Nordmann", email:"ola@epost.no",      phone:"91112233", relation_category:"Familie",   side_of_couple:"brudgom", rsvp_status:"accepted", allergies:"",        plus_one_allowed:false, plus_one_name:"",         notes:"Brudgommens fetter"},
  {id:22, first_name:"Kari",     last_name:"Nordmann", email:"kari@epost.no",     phone:"92223344", relation_category:"Familie",   side_of_couple:"brudgom", rsvp_status:"accepted", allergies:"Laktose", plus_one_allowed:false, plus_one_name:"",         notes:""},
];

const DEMO_VENDORS = [
  {id:"v101", name:"Lysebu Hotell",    category:"Lokale",      contact_name:"Trine Solberg",  email:"event@lysebu.no",     phone:"22512000", city:"Oslo", price_estimate:85000, price_actual:85000, status:"booked",        favorite:true,  notes:"Storsalen + hage til seremoni. Kapasitet 120 gjester."},
  {id:"v104", name:"Nordlys Studio",   category:"Fotograf",    contact_name:"Ingrid Bakke",   email:"ingrid@nordlys.no",   phone:"93214567", city:"Oslo", price_estimate:38000, price_actual:38000, status:"booked",        favorite:true,  notes:"8 timers fotografering + redigert video."},
  {id:"v106", name:"Smakshuset AS",    category:"Catering",    contact_name:"Henning Larsen", email:"post@smakshuset.no",  phone:"22456789", city:"Oslo", price_estimate:72000, price_actual:68000, status:"booked",        favorite:true,  notes:"3-retters meny. Ca 850 kr/pers inkl vin."},
  {id:"v103", name:"Blomsterloftet",   category:"Blomster",    contact_name:"Hanne Blom",     email:"hanne@blomster.no",   phone:"94567890", city:"Oslo", price_estimate:22000, price_actual:0,     status:"contacted",     favorite:false, notes:"Spesialister på pioner og eukalyptus."},
  {id:"v105", name:"DJ Erik Strand",   category:"Musikk / DJ", contact_name:"Erik Strand",    email:"erik@djstrand.no",    phone:"95678901", city:"Oslo", price_estimate:14000, price_actual:14000, status:"booked",        favorite:false, notes:"Spiller fra kl 18 til 01."},
  {id:"v109", name:"Salon Mille",      category:"Hår & makeup",contact_name:"Camille Wang",   email:"mille@salon.no",      phone:"96789012", city:"Oslo", price_estimate:8500,  price_actual:8500,  status:"booked",        favorite:true,  notes:"Prøvetime 3. juni."},
  {id:"v110", name:"Konditori Haugen", category:"Kake",        contact_name:"Per Haugen",     email:"bestilling@haugen.no",phone:"97890123", city:"Oslo", price_estimate:6500,  price_actual:6500,  status:"booked",        favorite:false, notes:"3-etasjers hvit kake med friske blomster."},
  {id:"v108", name:"Nettbuss Charter", category:"Transport",   contact_name:"Rune Dahl",      email:"charter@nettbuss.no", phone:"98901234", city:"Oslo", price_estimate:9500,  price_actual:0,     status:"quote_received",favorite:false, notes:"Shuttlebuss Oslo S — Lysebu t/r."},
  {id:"v102", name:"Grafisk Studio AS",category:"Annet",       contact_name:"Lotte Voss",     email:"post@grafisk.no",     phone:"99012345", city:"Oslo", price_estimate:4500,  price_actual:4200,  status:"booked",        favorite:false, notes:"Invitasjoner, bordkort og program."},
];


/* ─── DEMO WEDDING ─────────────────────────────────────── */
const DEMO_WEDDING_ID = "w_demo_sophie";
const DEMO_WEDDING_OBJ = {
  id:"w_demo_sophie", inviteCode:"SOPHIE",
  name1:"Sophie", name2:"Marcus", display_name:"Sophie & Marcus",
  date:"2025-06-21", date_uncertain:false,
  country:"Norge", city:"Oslo", venue:"Lysebu Hotell",
  venue_type:"Hotell med hage", guest_count:"50-100",
  budget_total:280000, budget_uncertain:false,
  wedding_style:"romantisk",
  planning_milestones:["date_set","venue_booked","budget_set","guest_list","photographer","catering","invitations","ceremony","attire"],
  partner_email:"marcus@epost.no",
};
const DEMO_WDATA = {
  wedding:      DEMO_WEDDING_OBJ,
  tasks:        INITIAL_TASKS,
  guests:       DEMO_GUESTS,
  budget:       INITIAL_BUDGET,
  vendors:      DEMO_VENDORS,
  giftList:     INITIAL_GIFTS,
  photoList:    INITIAL_PHOTOS,
  songList:     INITIAL_SONGS,
  guestbookList:INITIAL_GUESTBOOK,
  bookingList:  INITIAL_BOOKINGS,
  contracts:    [],
  vendorChats:  {},
};
const INITIAL_WEDDINGS = { [DEMO_WEDDING_ID]: DEMO_WDATA };


const DEMO_USERS = [
  {id:"u1", username:"sophie",     password:"bryllup2025",  role:"planner", name:"Sophie",         weddingId:"w_demo_sophie"},
  {id:"u2", username:"marcus",     password:"bryllup2025",  role:"planner", name:"Marcus",         weddingId:"w_demo_sophie"},
  {id:"u3", username:"nordlys",    password:"foto123",      role:"vendor",  name:"Ingrid Bakke",   vendorId:"v104", vendorName:"Nordlys Studio",  category:"Fotograf"},
  {id:"u4", username:"smakshuset", password:"catering123",  role:"vendor",  name:"Henning Larsen", vendorId:"v106", vendorName:"Smakshuset AS",   category:"Catering"},
  {id:"u5", username:"salonmille", password:"hair123",      role:"vendor",  name:"Camille Wang",   vendorId:"v109", vendorName:"Salon Mille",      category:"Hår & makeup"},
  {id:"u6", username:"lysebu",     password:"hotell123",    role:"vendor",  name:"Trine Solberg",  vendorId:"v101", vendorName:"Lysebu Hotell",    category:"Lokale"},
  {id:"u7", username:"haugen",     password:"kake123",      role:"vendor",  name:"Per Haugen",     vendorId:"v110", vendorName:"Konditori Haugen", category:"Kake"},
  {id:"u8", username:"gjest",      password:"gjest123",     role:"guest",   name:"Gjest",          weddingId:"w_demo_sophie"},
{id:"u_test_1", username:"kristian", password:"bryllup2026", role:"planner", name:"Kristian", weddingId:"w_test_1"},
];
const DEMO_USER_IDS = new Set(["u1","u2","u3","u4","u5","u6","u7","u8"]);


export default function App() {
  /* ── ALL STATE ── */

  // weddings map — initial value from module-level constant
  const [weddings, setWeddings] = useState(INITIAL_WEDDINGS);

  const [loaded,      setLoaded]      = useState(false);
  const [page,        setPage]        = useState("home");
  const [mode,        setMode]        = useState("planner");
const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bryllup3:currentUser")) || null; } catch { return null; }
  });
  const [selVendorId, setSelVendorId] = useState(null);
  const [drawer,      setDrawer]      = useState(false);
  const [toast,       setToast]       = useState(null);
  const [saveStatus,  setSaveStatus]  = useState("saved");
  const [users, setUsers] = useState(DEMO_USERS);

  // ── Derived: active wedding data for logged-in user ──
  const activeWeddingId = currentUser?.weddingId || null;
  // Always ensure demo wedding exists (in case storage cleared it)
  // Demo wedding is ALWAYS sourced from module-level constants — never localStorage
const effectiveWeddings = {
    ...weddings,
    [DEMO_WEDDING_ID]: DEMO_WDATA,
    "w_test_1": weddings["w_test_1"] || {
      wedding: {id:"w_test_1", invite_code:"TEST01", name1:"Kristian", name2:"Partner", display_name:"Kristian & Partner", date:"2026-06-21", country:"Norge", city:"Bergen", budget_total:250000, wedding_style:"romantisk"},
      tasks: [], guests: [], budget: [], vendors: [],
      giftList: [], photoList: [], songList: [],
      guestbookList: [], bookingList: [], contracts: [], vendorChats: {},
    },
  };
  const activeWData = activeWeddingId ? effectiveWeddings[activeWeddingId] : null;

  // Helpers to read/write active wedding's sub-state
  const wedding   = activeWData?.wedding       || null;
  const tasks     = activeWData?.tasks         || [];
  const guests    = activeWData?.guests        || [];
  const budget    = activeWData?.budget        || [];
  const vendors   = activeWData?.vendors       || [];
  const giftList  = activeWData?.giftList      || [];
  const photoList = activeWData?.photoList     || [];
  const songList  = activeWData?.songList      || [];
  const guestbookList = activeWData?.guestbookList || [];
  const bookingList   = activeWData?.bookingList   || [];
  const contracts     = activeWData?.contracts     || [];
  const vendorChats   = activeWData?.vendorChats   || {};

  const updateWedding = (wid, field, value) =>
    setWeddings(prev => ({...prev, [wid]: {...prev[wid], [field]: value}}));

  const setWedding        = v => updateWedding(activeWeddingId, 'wedding',       v);
  const setTasks          = v => updateWedding(activeWeddingId, 'tasks',         typeof v==='function' ? v(tasks)   : v);
  const setGuests         = v => updateWedding(activeWeddingId, 'guests',        typeof v==='function' ? v(guests)  : v);
  const setBudget         = v => updateWedding(activeWeddingId, 'budget',        typeof v==='function' ? v(budget)  : v);
  const setVendors        = v => updateWedding(activeWeddingId, 'vendors',       typeof v==='function' ? v(vendors) : v);
  const setGiftList       = v => updateWedding(activeWeddingId, 'giftList',      typeof v==='function' ? v(giftList): v);
  const setPhotoList      = v => updateWedding(activeWeddingId, 'photoList',     typeof v==='function' ? v(photoList): v);
  const setSongList       = v => updateWedding(activeWeddingId, 'songList',      typeof v==='function' ? v(songList): v);
  const setGuestbookList  = v => updateWedding(activeWeddingId, 'guestbookList', typeof v==='function' ? v(guestbookList): v);
  const setBookingList    = v => updateWedding(activeWeddingId, 'bookingList',   typeof v==='function' ? v(bookingList): v);
  const setContracts      = v => updateWedding(activeWeddingId, 'contracts',     typeof v==='function' ? v(contracts): v);
  const setVendorChats    = v => updateWedding(activeWeddingId, 'vendorChats',   typeof v==='function' ? v(vendorChats): v);
  // ── VENDOR: find which wedding(s) this vendor is associated with ──
  // A vendor appears in weddings[wId].vendors list when a planner adds them.
  // We also match by vendorId from the catalog.
  const vendorWeddingId = (() => {
    if (currentUser?.role !== 'vendor') return null;
    const vid = currentUser?.vendorId;
    if (!vid) return null;
    // Find a wedding where this vendor appears
    return Object.keys(effectiveWeddings).find(wid => {
      const vList = effectiveWeddings[wid]?.vendors || [];
      return vList.some(v => v.id === vid || String(v.id) === String(vid));
    }) || null;
  })();

  // Vendor-specific sub-state (reads/writes to the couple's wedding)
  const vendorWData    = vendorWeddingId ? effectiveWeddings[vendorWeddingId] : null;
  const vendorWedding  = vendorWData?.wedding     || null;
  const vendorGuests   = vendorWData?.guests       || [];
  const vendorContracts= vendorWData?.contracts    || [];
  const vendorChatsRaw = vendorWData?.vendorChats  || {};

  const setVendorContracts = v => updateWedding(vendorWeddingId, 'contracts',
    typeof v === 'function' ? v(vendorContracts) : v);
  const setVendorChatsCtx  = v => updateWedding(vendorWeddingId, 'vendorChats',
    typeof v === 'function' ? v(vendorChatsRaw) : v);

  // ── GUEST: derive which wedding they belong to ──
  const guestWeddingId = currentUser?.role === 'guest' ? currentUser?.weddingId : null;
  const guestWData     = guestWeddingId ? effectiveWeddings[guestWeddingId] : null;
  const guestWedding   = guestWData?.wedding       || null;
  const guestGuests    = guestWData?.guests         || [];
  const guestGifts     = guestWData?.giftList       || [];
  const guestPhotos    = guestWData?.photoList      || [];
  const guestSongs     = guestWData?.songList       || [];
  const guestGuestbook = guestWData?.guestbookList  || [];
  const guestBookings  = guestWData?.bookingList    || [];

  const setGuestGuests   = v => updateWedding(guestWeddingId,'guests',      typeof v==='function'?v(guestGuests):v);
  const setGuestGifts    = v => updateWedding(guestWeddingId,'giftList',    typeof v==='function'?v(guestGifts):v);
  const setGuestPhotos   = v => updateWedding(guestWeddingId,'photoList',   typeof v==='function'?v(guestPhotos):v);
  const setGuestSongs    = v => updateWedding(guestWeddingId,'songList',    typeof v==='function'?v(guestSongs):v);
  const setGuestGuestbook= v => updateWedding(guestWeddingId,'guestbookList',typeof v==='function'?v(guestGuestbook):v);
  const setGuestBookings = v => updateWedding(guestWeddingId,'bookingList', typeof v==='function'?v(guestBookings):v);

  const guestName = currentUser?.name || "";

  const showToast = useCallback(msg => { setToast(null); setTimeout(()=>setToast(msg),10); }, []);
  const clearToast = useCallback(() => setToast(null), []);

  // ── Expose vendor registration hook ──
  useEffect(() => {
    window.__addVendorFromAuth = (v) => {
      // Add vendor to ALL wedding vendor lists (or just current — vendors are global catalog)
      // For now just update the active wedding if logged in
      if (activeWeddingId) setVendors(prev => [...prev, v]);
    };
    return () => { delete window.__addVendorFromAuth; };
  }, [activeWeddingId]);

    // Keep a ref to latest state so async handlers always see fresh data
  const stateRef = useRef({});
  useEffect(() => {
    stateRef.current = { weddings, users };
  }, [wedding, tasks, guests, budget, vendors, page]);

/* ─── CORE SAVE FUNCTION ─── */
  const doSave = useCallback(async (data) => {
    const d = data || stateRef.current;
    try {
      Object.entries(d).forEach(([k,v]) => {
        try { localStorage.setItem("bryllup3:"+k, JSON.stringify(v)); } catch {}
      });
    } catch {}
    try {
      const wid = activeWeddingId;
      if (!wid || wid === "w_demo_sophie") return;
      const w = d.weddings?.[wid];
      if (!w) return;
      if (w.wedding) await supabase.from("weddings").upsert({...w.wedding, id: wid});
      if (w.guests)  await supabase.from("guests").upsert(w.guests.map(g=>({...g, wedding_id: wid})));
      if (w.tasks)   await supabase.from("tasks").upsert(w.tasks.map(t=>({...t, wedding_id: wid})));
      if (w.budget)  await supabase.from("budget").upsert(w.budget.map(b=>({...b, wedding_id: wid})));
      if (w.vendors) await supabase.from("vendors").upsert(w.vendors.map(v=>({...v, wedding_id: wid})));
    } catch(e) { console.error("Supabase save error:", e); }
  }, [activeWeddingId]);

  /* ─── LOAD ON MOUNT ─── */
  useEffect(() => {
    // Show the app immediately — demo data is already set as default state.
    // Then hydrate from storage in the background if saved data exists.

    const hydrate = async () => {
      // 1. localStorage først (rask)
      try {
        const rawW = localStorage.getItem("bryllup3:weddings");
        const rawU = localStorage.getItem("bryllup3:users");
        if (rawW) setWeddings(() => ({...JSON.parse(rawW), [DEMO_WEDDING_ID]: DEMO_WDATA}));
        if (rawU) {
          const custom = JSON.parse(rawU).filter(u => !DEMO_USER_IDS.has(u.id));
          setUsers([...DEMO_USERS, ...custom]);
        }
      } catch {}
      // 2. Supabase (henter fersk data)
      try {
        const { data: weddingRows } = await supabase.from("weddings").select("*");
        if (weddingRows?.length) {
          const wMap = {};
          for (const w of weddingRows) {
            const [tasks, guests, budget, vendors] = await Promise.all([
              supabase.from("tasks").select("*").eq("wedding_id", w.id),
              supabase.from("guests").select("*").eq("wedding_id", w.id),
              supabase.from("budget").select("*").eq("wedding_id", w.id),
              supabase.from("vendors").select("*").eq("wedding_id", w.id),
            ]);
            wMap[w.id] = {
              wedding: w,
              tasks: tasks.data || [],
              guests: guests.data || [],
              budget: budget.data || [],
              vendors: vendors.data || [],
              giftList: [], photoList: [], songList: [],
              guestbookList: [], bookingList: [], contracts: [], vendorChats: {},
            };
          }
          setWeddings(prev => ({...prev, ...wMap, [DEMO_WEDDING_ID]: DEMO_WDATA}));
        }
      } catch(e) { console.error("Supabase hydrate error:", e); }
    };

    hydrate().then(() => setLoaded(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── SAVE ON EVERY CHANGE (200ms debounce) ─── */
  useEffect(() => {
    if (!loaded) return;
    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      await doSave({ wedding, tasks, guests, budget, vendors, page });
      setSaveStatus("saved");
    }, 200); // Short — 200ms is fast enough to not feel sluggish
    return () => clearTimeout(timer);
  }, [loaded, wedding, tasks, guests, budget, vendors, page, mode, guestName, doSave]);

  /* ─── SAVE IMMEDIATELY WHEN TAB LOSES FOCUS / CLOSES ─── */
  useEffect(() => {
    const flush = () => {
      // Synchronous localStorage save (works even during unload)
      const d = stateRef.current;
      try {
        Object.entries(d).forEach(([k,v]) => {
          try { localStorage.setItem("bryllup3:"+k, JSON.stringify(v)); } catch {}
        });
      } catch {}
      // Fire async artifact save too (may or may not complete)
      if (typeof window.storage !== "undefined") {
        Object.entries(d).forEach(([k,v]) => {
          window.storage.set("app3:"+k, JSON.stringify(v)).catch(()=>{});
        });
      }
    };
    // visibilitychange fires when switching tabs or minimizing — most reliable
    document.addEventListener("visibilitychange", flush);
    // pagehide is more reliable than beforeunload on mobile
    window.addEventListener("pagehide", flush);
    // beforeunload as extra fallback
    window.addEventListener("beforeunload", flush);
    return () => {
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
    };
  }, []); // runs once — uses stateRef which always has latest data

  /* resetAll must be defined BEFORE pageContent useMemo */
  const resetAll = useCallback(async () => {
    const keys = ["wedding","tasks","guests","budget","vendors","page"];
    if (typeof window.storage !== "undefined") {
      try { await Promise.all(keys.map(k=>window.storage.delete("app3:"+k).catch(()=>{}))); } catch {}
    }
    try { keys.forEach(k=>{ try { localStorage.removeItem("bryllup3:"+k); } catch {} }); } catch {}
    setWeddings(INITIAL_WEDDINGS);
    setPage("home");
    showToast("Tilbakestilt til demodata");
  }, [showToast]);

  /* Memoized page content — planner only (vendor/guest handled by early returns above) */
  const pageContent = useMemo(() => {
    if (!wedding) return null;
    switch(page) {
      case "home":     return <Dashboard wedding={wedding} tasks={tasks} guests={guests} budget={budget} vendors={vendors} setPage={setPage} showToast={showToast}/>;
      case "tasks":    return <Tasks tasks={tasks} setTasks={setTasks} showToast={showToast}/>;
      case "guests":   return <Guests guests={guests} setGuests={setGuests} showToast={showToast} wedding={wedding}/>;
      case "vendors":  return <Vendors vendors={vendors} setVendors={setVendors} showToast={showToast} wedding={wedding} chats={vendorChats} setChats={setVendorChats}/>;
      case "budget":   return <Budget budget={budget} setBudget={setBudget} wedding={wedding} showToast={showToast}/>;
      case "seating":  return <Seating guests={guests} showToast={showToast}/>;
      case "ai":       return <AIAssistant wedding={wedding} tasks={tasks} guests={guests} budget={budget} vendors={vendors}/>;
      case "comms":    return <Communication guests={guests} wedding={wedding} showToast={showToast}/>;
      case "gifts":    return <GiftList gifts={giftList} setGifts={setGiftList} showToast={showToast}/>;
      case "photos":   return <PlannerPhotos photos={photoList} setPhotos={setPhotoList} showToast={showToast}/>;
      case "songs":    return <PlannerSongs songs={songList} setSongs={setSongList} showToast={showToast}/>;
      case "guestbook":return <PlannerGuestbook entries={guestbookList} setEntries={setGuestbookList} showToast={showToast}/>;
      case "contracts": return <PlannerContracts contracts={contracts} setContracts={setContracts} wedding={wedding} currentUser={currentUser} showToast={showToast}/>;
      case "bookings": return <PlannerBookings bookings={bookingList} setBookings={setBookingList} showToast={showToast}/>;
      case "settings": return <Settings wedding={wedding} setWedding={setWedding} showToast={showToast} resetAll={resetAll} inviteCode={myInviteCode}/>;
      default:         return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, mode, wedding, tasks, guests, budget, vendors, resetAll]);

  /* ── EARLY RETURNS — after all hooks ── */
  // ── AUTH GATE ──
  // Show invite code in settings for planners
  const myInviteCode = wedding?.inviteCode || null;

  if (!currentUser && loaded) return (
    <AuthScreen
      users={users}
      setUsers={setUsers}
      weddings={weddings}
      vendors={vendors}
      onLogin={(user, newWeddingData) => {
        // If a new wedding was created during registration, add it
        if (newWeddingData) {
          setWeddings(prev => ({...prev, [newWeddingData.id]: newWeddingData.data}));
          setUsers(prev => prev.map(u => u.id===user.id ? {...u, weddingId:newWeddingData.id} : u));
          user = {...user, weddingId: newWeddingData.id};
        }
        setCurrentUser(user);
        localStorage.setItem("bryllup3:currentUser", JSON.stringify(user));
        if (user.role==="vendor") {
          setSelVendorId(user.vendorId);
          setMode("vendor");
        } else if (user.role==="guest") {
          setMode("guest");
        } else {
          setMode("planner");
        }
      }}
    />
  );

  if (!loaded) return (
    <div style={{height:"100dvh",background:"#3A3028",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
      <CSS/>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:500,color:"rgba(255,255,255,.8)",animation:"shimmer 1.5s ease infinite",letterSpacing:".04em"}}>Bryllupsappen</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,.25)",letterSpacing:".2em",textTransform:"uppercase"}}>Laster inn</div>
    </div>
  );

  // Vendor and guest don't need a wedding — route them directly
  if (currentUser?.role === "vendor") {
    return (
      <div style={{height:"100dvh",width:"100%",overflow:"hidden"}}>
        <CSS/>
        <VendorDashboard
          wedding={vendorWedding}
          vendors={vendorWData?.vendors || []}
          setVendors={v => updateWedding(vendorWeddingId, 'vendors', typeof v==='function'?v(vendorWData?.vendors||[]):v)}
          chats={vendorChatsRaw}
          setChats={setVendorChatsCtx}
          selVendorId={selVendorId}
          currentUser={currentUser}
          showToast={showToast}
          onBack={()=>setCurrentUser(null)}
          guests={vendorGuests}
          contracts={vendorContracts}
          setContracts={setVendorContracts}
          weddingId={vendorWeddingId}
        />
        {toast&&<Toast msg={toast} onDone={clearToast}/>}
      </div>
    );
  }

  if (currentUser?.role === "guest") {
    return (
      <div style={{height:"100dvh",width:"100%",overflow:"hidden"}}>
        <CSS/>
        <GuestPortal
          wedding={guestWedding}
          guests={guestGuests}       setGuests={setGuestGuests}
          budget={guestWData?.budget || []}
          gifts={guestGifts}         setGifts={setGuestGifts}
          photos={guestPhotos}       setPhotos={setGuestPhotos}
          songs={guestSongs}         setSongs={setGuestSongs}
          guestbook={guestGuestbook} setGuestbook={setGuestGuestbook}
          bookings={guestBookings}   setBookings={setGuestBookings}
          currentUser={currentUser}
          showToast={showToast}
          onBack={()=>setCurrentUser(null)}
        />
        {toast&&<Toast msg={toast} onDone={clearToast}/>}
      </div>
    );
  }

  // Planner: if demo user has no wedding data, restore it automatically
  if (!wedding && currentUser?.weddingId === DEMO_WEDDING_ID) {
    setWeddings(prev => ({...prev, [DEMO_WEDDING_ID]: DEMO_WDATA}));
    return (
      <div style={{height:"100dvh",background:"#3A3028",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <CSS/><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"rgba(255,255,255,.7)"}}>Laster…</div>
      </div>
    );
  }

  // Planner: show onboarding if no wedding yet
  if (!wedding) return (
    <div style={{height:"100dvh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--ivory)"}}>
      <CSS/>
      <Onboarding onComplete={w => { setWedding({...w, inviteCode: w.inviteCode || myInviteCode || ("W"+Date.now().toString().slice(-6))}); setPage("home"); }}/>
    </div>
  );

  const urgentOpen = tasks.filter(t=>t.status!=="done"&&t.status!=="cancelled"&&t.priority==="critical").length;

  const MORE_PAGES = [
    {id:"budget",   label:"Budsjett",      icon:"◷"},
    {id:"seating",  label:"Bordplan",      icon:"⊞"},
    {id:"ai",       label:"AI-assistent",  icon:"✧"},
    {id:"comms",    label:"Meldinger",     icon:"✉"},
    {id:"gifts",    label:"Ønskeliste",    icon:"◇"},
    {id:"photos",   label:"Bildedeling",   icon:"◫"},
    {id:"songs",    label:"Musikk­ønsker",  icon:"♪"},
    {id:"guestbook",label:"Gjestebok",      icon:"✐"},
    {id:"bookings", label:"Booking",        icon:"◎"},
    {id:"contracts",label:"Kontrakter",    icon:"✦"},
    {id:"settings", label:"Innstillinger", icon:"◐"},
  ];

  return (
    <div id="root">
      <CSS/>

      {/* Desktop sidebar */}
      <Sidebar page={page} setPage={p=>{setPage(p);setDrawer(false);}} wedding={wedding} tasks={tasks} saveStatus={saveStatus} mode={mode} setMode={setMode}/>

      {/* Content column: topbar + page + bottom-nav */}
      <div className="app-content">

        {/* Top bar — always shown on mobile, hidden on desktop */}
        <div className="top-bar">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {(page==="seating"||page==="ai") && mode==="planner" && (
              <button onClick={()=>setPage("home")}
                style={{background:"var(--stone)",border:"1px solid var(--border)",borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,color:"var(--text)",flexShrink:0,fontWeight:600}}>
                ←
              </button>
            )}
            <div>
              <div className="tb-title">{mode==="guest"?"Gjesteportal":mode==="vendor"?"Leverandørportal":NAV_PLANNER.find(n=>n.id===page)?.label||"Bryllupsappen"}</div>
              <div className="tb-sub" style={{display:"flex",alignItems:"center",gap:5}}>
                {wedding.display_name}
                {mode==="planner"&&<span style={{fontSize:9,color:saveStatus==="saving"?"var(--faint)":"var(--green)",fontWeight:600,letterSpacing:".04em"}}>{saveStatus==="saving"?"· lagrer…":"· lagret"}</span>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
<button onClick={()=>setCurrentUser(null)}
              style={{padding:"6px 14px",borderRadius:20,border:"1.5px solid var(--border)",background:"var(--white)",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'Inter',sans-serif",color:"var(--text)",display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:14}}>⇤</span> Logg ut
            </button>
            <div className="tb-avatar">{wedding.name1?.[0]||"?"}</div>
          </div>
        </div>

        {/* Page area */}
        <div className={`scroll-area${(mode==="guest"||mode==="vendor"||(mode==="planner"&&(page==="seating"||page==="ai"||page==="vendors")))?" full-h":""}`}>
          {pageContent}
        </div>

        {/* Bottom nav — planner vs guest */}
        {mode==="planner" ? (
          <>
            <nav className="bottom-nav">
              {BOTTOM_NAV.map(n=>{
                const isMore = n.id==="more";
                const isActive = isMore ? MORE_PAGES.some(m=>m.id===page)||drawer : page===n.id;
                return (
                  <div key={n.id} className={`bn-item ${isActive?"active":""}`} onClick={()=>{
                    if(isMore){setDrawer(d=>!d);return;}
                    setPage(n.id);setDrawer(false);
                  }}>
                    <span className="bn-icon">{n.icon}</span>
                    <span>{n.label}</span>
                    {n.id==="tasks"&&urgentOpen>0&&<div className="bn-badge">{urgentOpen}</div>}
                  </div>
                );
              })}
            </nav>
            {drawer&&(
              <>
                <div style={{position:"absolute",inset:"0 0 var(--nav-h) 0",zIndex:29}} onClick={()=>setDrawer(false)}/>
                <div style={{position:"absolute",bottom:"var(--nav-h)",left:0,right:0,background:"#3A3028",borderTop:"1px solid rgba(255,255,255,.1)",padding:"14px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,zIndex:30,animation:"slideUp .22s ease"}}>
                  {MORE_PAGES.map(p=>(
                    <button key={p.id} onClick={()=>{setPage(p.id);setDrawer(false);}}
                      style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:page===p.id?"rgba(255,255,255,.1)":"transparent",borderRadius:10,border:"none",cursor:"pointer",color:page===p.id?"var(--bronze)":"rgba(255,255,255,.6)",fontSize:14,fontFamily:"'Inter',sans-serif",fontWeight:500,transition:"all .15s",textAlign:"left"}}>
                      <span style={{fontSize:16}}>{p.icon}</span>{p.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          /* Guest bottom nav — handled inside GuestPortal tabs, just show back button */
          <div style={{flexShrink:0,height:"calc(var(--nav-h) + var(--safe-b))",paddingBottom:"var(--safe-b)",background:"var(--white)",borderTop:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <button onClick={()=>setMode("planner")}
              style={{padding:"10px 28px",borderRadius:20,border:"1.5px solid var(--border)",background:"transparent",fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600,color:"var(--muted)",cursor:"pointer"}}>
              ← Tilbake til planner
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast&&<Toast msg={toast} onDone={clearToast}/>}
    </div>
  );
}