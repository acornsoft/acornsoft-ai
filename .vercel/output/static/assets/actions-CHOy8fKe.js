import{t as e}from"./createClientRpc-CAXBLao_.js";import{o as t,s as n}from"./site-chrome-DDyGWEGU.js";var r=`---
id: cn-001
number: "001"
title: Advanced Development
date: 2026-07-31
status: published
tags:
  - climb-note
  - advanced-development
  - research
xUrl:
---

## Problem

Research in public is usually a thread or a demo. It rarely leaves a climb: problem, measure, slice, lesson. Without that energy, tools fade.

## Measure

A reader can open a small usable tool, see claims next to sources, and follow the trail on this site and Canopy without us speaking for SpaceXAI or any other company.

## Slice

Advanced Development: first-principles research in the open with Grok Build, Imagine, and Voice. Live example—the Unofficial COVID Report: primary documents, color-coded claims, year and theme filters. Standouts on Canopy under Advanced Development.

## Lesson

Climb Notes are our energy. The difference maker is the written climb, not the model alone. Failure is tuition—write it down, improve the next slice. The record is the boss.
`,i=`---
id: cn-002
number: "002"
title: Climb Notes Publish Gate
date: 2026-07-31
status: approved
tags:
  - climb-note
  - process
  - publish-control
xUrl:
---

## Problem

Every climb should be written, but not every climb is ready for the public journal. Without a gate, drafts leak or finished work never ships.

## Measure

Studio library lists every note. Public journal shows only Published. Pull in and out leaves the Markdown file intact.

## Slice

SharePoint-style lifecycle on this site: Draft → Pending approval → Approved → Published, plus Archive and Unpublish. Registry file owns the gate; Obsidian owns the words.

## Lesson

Write freely. Publish deliberately. The library holds energy; the gate protects trust.
`,a='# Climb Notes — Obsidian vault folder\n\n**Authoring:** Obsidian Markdown.  \n**Site storage:** files synced into this folder.  \n**Publish gate:** `_publish-registry.json` (SharePoint-style lifecycle).  \n**Automation:** `npm run climb-notes:sync` / `npm run climb-notes:watch`\n\n## Lifecycle (pull in / pull out)\n\n| Status | Public journal | Studio library |\n| --- | --- | --- |\n| `draft` | No | Yes |\n| `pending` | No (awaiting approval) | Yes |\n| `approved` | No (ready, not live) | Yes |\n| `published` | **Yes** | Yes |\n| `archived` | No | Yes |\n\nCommands (update registry + frontmatter `status`):\n\n```bash\nnpm run climb-notes:publish -- list\nnpm run climb-notes:publish -- submit cn-002\nnpm run climb-notes:publish -- approve cn-002 --by acornsoft --note "Ready"\nnpm run climb-notes:publish -- publish cn-002\nnpm run climb-notes:publish -- unpublish cn-002   # pull out of public\nnpm run climb-notes:publish -- archive cn-002\nnpm run climb-notes:publish -- restore cn-002\nnpm run climb-notes:publish -- status cn-001\n```\n\n- **Publish** = pull into the public journal.  \n- **Unpublish** = pull out (Markdown stays; Studio still shows it).  \n- Registry **wins** over frontmatter if both disagree.\n\n## One-time setup\n\n1. In Obsidian, keep climbing logs in a folder (e.g. `Climb Notes`).\n2. Copy `.climb-notes-sync.example.json` → `.climb-notes-sync.json` at repo root.\n3. Set `"vault"` to that folder’s absolute path.  \n   Or: `export CLIMB_NOTES_VAULT="/path/to/Climb Notes"`\n4. Run:\n   ```bash\n   npm run climb-notes:sync    # one-shot\n   npm run climb-notes:watch   # auto-copy on save\n   ```\n5. Keep the site dev process running so Markdown reloads.\n\n## File rules\n\n- Note files: `001 Title.md`, `002 Title.md` (top-level `*.md` in vault)\n- Template: `templates/Climb Note.md`\n- Required headings: `## Problem` · `## Measure` · `## Slice` · `## Lesson`\n- Frontmatter: `id`, `number`, `title`, `date`, `status`, optional `tags`, `xUrl`\n- Do not edit `_publish-registry.json` by hand unless you know the shape—prefer the CLI\n\n## Flow\n\n```\nObsidian (draft)\n  → sync script → content/climb-notes\n  → submit / approve / publish (CLI)\n  → public /climb-notes  (published only)\n  → Studio library tab   (every note)\n  → optional short citation on X\n```\n\nX remains optional short citation only—and only after Published.\n',o={version:1,description:`SharePoint-style publish control for Climb Notes. Registry status wins over frontmatter. Public site shows only published. Studio view shows every note.`,notes:{"cn-001":{status:`published`,version:1,submittedAt:`2026-07-31T12:00:00.000Z`,submittedBy:`acornsoft`,approvedAt:`2026-07-31T12:05:00.000Z`,approvedBy:`acornsoft`,publishedAt:`2026-07-31T12:10:00.000Z`,unpublishedAt:null,approvalNote:`First Climb Note — Advanced Development energy.`,history:[{at:`2026-07-31T12:00:00.000Z`,action:`submit`,by:`acornsoft`,note:`Ready for review`},{at:`2026-07-31T12:05:00.000Z`,action:`approve`,by:`acornsoft`,note:`Approved for public journal`},{at:`2026-07-31T12:10:00.000Z`,action:`publish`,by:`acornsoft`,note:`Live on Climb Notes`}]},"cn-002":{status:`approved`,version:1,submittedAt:`2026-07-31T14:50:35.452Z`,submittedBy:`acornsoft`,approvedAt:`2026-07-31T14:50:35.484Z`,approvedBy:`acornsoft`,publishedAt:null,unpublishedAt:null,approvalNote:`Process note approved`,history:[{at:`2026-07-31T14:50:35.452Z`,action:`submit`,by:`acornsoft`,note:`Ready for review`},{at:`2026-07-31T14:50:35.484Z`,action:`approve`,by:`acornsoft`,note:`Process note approved`}]}}},s=[`draft`,`pending`,`approved`,`published`,`archived`],c={draft:`Draft`,pending:`Pending approval`,approved:`Approved`,published:`Published`,archived:`Archived`};function l(e){return e===`published`}var u=Object.assign({"../../../content/climb-notes/001 Advanced Development.md":r,"../../../content/climb-notes/002 Climb Notes Publish Gate.md":i,"../../../content/climb-notes/README.md":a}),d=o;function f(e){if(typeof e!=`string`)return;let t=e.trim().toLowerCase();return s.includes(t)?t:void 0}function p(e){let t=e.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);if(!t)return{data:{},body:e.trim()};let n={},r=null;for(let e of t[1].split(/\r?\n/)){let t=e.match(/^\s+-\s+(.+)$/);if(t&&r){let e=Array.isArray(n[r])?n[r]:[];e.push(t[1].trim().replace(/^["']|["']$/g,``)),n[r]=e;continue}let i=e.match(/^([A-Za-z0-9_]+):\s*(.*)$/);if(!i)continue;let a=i[1],o=i[2].trim();if(o===``||o===`null`||o===`~`){n[a]=void 0,r=a===`tags`?`tags`:null,a===`tags`&&(n.tags=[]);continue}r=null,n[a]=o.replace(/^["']|["']$/g,``)}return{data:n,body:t[2].trim()}}function m(e,t){let n=RegExp(`##\\s+${t}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n##\\s+|$)`,`i`),r=e.match(n);return r?r[1].trim():``}function h(e,t){let n=d.notes?.[e];return{status:f(n?.status)??t??`draft`,version:n?.version,submittedAt:n?.submittedAt,submittedBy:n?.submittedBy,approvedAt:n?.approvedAt,approvedBy:n?.approvedBy,publishedAt:n?.publishedAt,unpublishedAt:n?.unpublishedAt,approvalNote:n?.approvalNote,history:n?.history}}function g(e,t){if(/README\.md$/i.test(e)||/_publish-registry/i.test(e))return null;let{data:n,body:r}=p(t),i=String(n.id??``).trim();if(!i)return null;let a=Array.isArray(n.tags)?n.tags:void 0,o=typeof n.xUrl==`string`&&n.xUrl.length>0?n.xUrl:void 0,s=f(n.status),c=h(i,s);return{id:i,number:String(n.number??``).replace(/"/g,``),title:String(n.title??`Untitled`),date:String(n.date??``),problem:m(r,`Problem`),measure:m(r,`Measure`),slice:m(r,`Slice`),lesson:m(r,`Lesson`),status:c.status,frontmatterStatus:s,version:c.version,submittedAt:c.submittedAt,submittedBy:c.submittedBy,approvedAt:c.approvedAt,approvedBy:c.approvedBy,publishedAt:c.publishedAt,unpublishedAt:c.unpublishedAt,approvalNote:c.approvalNote,history:c.history,xUrl:o,tags:a?.length?a:void 0,sourceFile:e.split(`/`).pop()}}var _=Object.entries(u).map(([e,t])=>g(e,t)).filter(e=>e!==null).sort((e,t)=>t.number.localeCompare(e.number));_.filter(e=>l(e.status));function v(e=_){let t={all:e.length,draft:0,pending:0,approved:0,published:0,archived:0};for(let n of e)t[n.status]+=1;return t}function y(e,t=`https://acornsoft.ai`){let n=e.lesson.length>180?`${e.lesson.slice(0,177)}…`:e.lesson;return`Climb Note ${e.number} · ${e.title}

${n}

Full note (stored on site):
${t}/climb-notes#${e.id}
`}n({method:`GET`}).middleware([t]).handler(e(`efcea5e11398266e21ed45e59ac4ab78cf01266b4295f7686bda6c4ddde96d0b`));var b=n({method:`GET`}).handler(e(`60421b9274a2bd4b9115e8f7d76ffacb8ab053e23d485f936ea2702cefa2c0ec`)),x=n({method:`GET`}).handler(e(`d137f7a31193db0a03420d1eacde7bac04eab54aa8a28e9a1f174d6ad56d4268`)),S=n({method:`GET`}).middleware([t]).handler(e(`ba5de35fa2c9d207dbfb88c7e81fe0c4087dfa6c4428386ecbe2cea791decfac`)),C=n({method:`POST`}).middleware([t]).handler(e(`a01550a269060fa6e6ced5673df71991261b89f4e2ab07d9bf7a560f73ad0750`)),w=n({method:`POST`}).middleware([t]).handler(e(`3f5063c5ffc089c9bb5cc15757890c472f7f9ed0892447adec116562a9b10780`)),T=n({method:`POST`}).middleware([t]).handler(e(`8355b895fa145f4148037c40067882bdfa72d5ca3bc3fa19c54d7fdf7611bd79`));export{C as a,_ as c,l as d,b as i,v as l,x as n,w as o,S as r,c as s,T as t,y as u};