const fs = require('fs');
const path = require('path');

const filesToFix = [
  {
    file: 'pages/programs/index.vue',
    replacements: [
      { s: "homeContent?.programsPageTitle || 'Strategic <span class=\\'text-white/40\\'>Programmes</span>'", r: "homeContent?.programsPageTitle || t('Strategic_Programmes_HTML')" },
      { s: "homeContent?.programsPageDescription || 'Explore our latest initiatives, strategic research projects, and policy recommendation programmes across the continent.'", r: "homeContent?.programsPageDescription || t('Programs_Description')" },
      { s: "<span class=\"text-sm font-black text-[#2E7D32] \">Filter Year:</span>", r: "<span class=\"text-sm font-black text-[#2E7D32] \">{{ t('Filter_Year') }}</span>" },
      { s: "{ label: 'ALL YEARS', value: 'all' }", r: "{ label: t('ALL_YEARS'), value: 'all' }" },
      { s: "<span class=\"text-sm font-black text-[#2E7D32] \">Month:</span>", r: "<span class=\"text-sm font-black text-[#2E7D32] \">{{ t('Month') }}</span>" },
      { s: "{ label: 'ALL MONTHS', value: 'all' }", r: "{ label: t('ALL_MONTHS'), value: 'all' }" },
      { s: "Details \\n                    <span", r: "{{ t('Details') }} \\n                    <span" },
      { s: "Details \n                    <span", r: "{{ t('Details') }} \n                    <span" },
      { s: "title=\"NO PROGRAMMES FOUND\"", r: ":title=\"t('NO_PROGRAMMES_FOUND')\"" },
      { s: "message=\"We couldn't find any strategic Programmes for the selected criteria. Please try adjusting your filters.\"", r: ":message=\"t('NO_PROGRAMMES_MSG')\"" },
      { s: ">\\n                    Details", r: ">\\n                    {{ t('Details') }}" },
      { s: ">\n                    Details", r: ">\n                    {{ t('Details') }}" }
    ]
  },
  {
    file: 'pages/archives.vue',
    replacements: [
      { s: "homeContent?.archivesPageTitle || 'Institutional <span class=\\'not-italic text-gray-400\\'>Archives</span>'", r: "homeContent?.archivesPageTitle || t('Institutional_Archives_HTML')" },
      { s: "homeContent?.archivesPageDescription || 'A comprehensive repository of past programmes, strategic evaluations, policy briefs, and historical documents from PANAFSTRAG operations.'", r: "homeContent?.archivesPageDescription || t('Archives_Description')" },
      { s: "{{ f === 'program' ? 'PAST PROGRAMMES' : f }}", r: "{{ f === 'program' ? t('PAST_PROGRAMMES') : t(f) }}" },
      { s: "{ label: 'ALL YEARS', value: 'all' }", r: "{ label: t('ALL_YEARS'), value: 'all' }" },
      { s: "{ label: 'ALL MONTHS', value: 'all' }", r: "{ label: t('ALL_MONTHS'), value: 'all' }" },
      { s: "placeholder=\"SELECT YEAR\"", r: ":placeholder=\"t('SELECT_YEAR')\"" },
      { s: "placeholder=\"SELECT MONTH\"", r: ":placeholder=\"t('SELECT_MONTH')\"" },
      { s: "Archive Year: <span", r: "{{ t('Archive_Year') }} <span" },
      { s: ">PROGRAMME<", r: ">{{ t('PROGRAMME') }}<" },
      { s: "VIEW DETAILS \n                        <svg", r: "{{ t('VIEW_DETAILS') }} \n                        <svg" },
      { s: "VIEW DETAILS \\n                        <svg", r: "{{ t('VIEW_DETAILS') }} \\n                        <svg" },
      { s: "DOWNLOAD RESOURCE\\n                      <svg", r: "{{ t('DOWNLOAD_RESOURCE') }}\\n                      <svg" },
      { s: "DOWNLOAD RESOURCE\n                      <svg", r: "{{ t('DOWNLOAD_RESOURCE') }}\n                      <svg" },
      { s: "title=\"ARCHIVES EMPTY\"", r: ":title=\"t('ARCHIVES_EMPTY')\"" },
      { s: "message=\"The intelligence repository for this category is currently being indexed or contains no public records.\"", r: ":message=\"t('ARCHIVES_EMPTY_MSG')\"" }
    ]
  },
  {
    file: 'pages/board/index.vue',
    replacements: [
      { s: "homeContent?.boardPageTitle || 'Board of <span class=\\'not-italic text-gray-400\\'>Trustees</span>'", r: "homeContent?.boardPageTitle || t('Board_Of_Trustees_HTML')" },
      { s: "homeContent?.boardPageDescription || 'Our Ubuntu Team members are distinguished professionals and scholars dedicated to African development and strategic policy research.'", r: "homeContent?.boardPageDescription || t('Board_Description')" },
      { s: ">View Profile —><", r: ">{{ t('View_Profile') }} —><" },
      { s: "title=\"BOARD VACANT\"", r: ":title=\"t('BOARD_VACANT')\"" },
      { s: "message=\"Ubuntu Team of Trustees registration for this term is currently being finalized.\"", r: ":message=\"t('BOARD_VACANT_MSG')\"" }
    ]
  },
  {
    file: 'pages/programs/[id].vue',
    replacements: [
      { s: ">\\n          Back to Programmes\\n        <", r: ">\\n          {{ t('Back_To_Programmes') }}\\n        <" },
      { s: ">\n          Back to Programmes\n        <", r: ">\n          {{ t('Back_To_Programmes') }}\n        <" },
      { s: ">Schedule<", r: ">{{ t('Schedule') }}<" },
      { s: ">Location<", r: ">{{ t('Location') }}<" },
      { s: ">Participation<", r: ">{{ t('Participation') }}<" },
      { s: "{{ program?.speakers?.length === 1 ? 'Speaker' : 'Speakers' }}", r: "{{ program?.speakers?.length === 1 ? t('Speaker') : t('Speakers') }}" },
      { s: ">The session is live<", r: ">{{ t('Session_Is_Live') }}<" },
      { s: ">Past Session Recordings / Links<", r: ">{{ t('Past_Session_Links') }}<" },
      { s: ">\\n               Watch Via Zoom\\n              <", r: ">\\n               {{ t('Watch_Via_Zoom') }}\\n              <" },
      { s: ">\n               Watch Via Zoom\n              <", r: ">\n               {{ t('Watch_Via_Zoom') }}\n              <" },
      { s: ">\\n                Watch Via Meet\\n              <", r: ">\\n                {{ t('Watch_Via_Meet') }}\\n              <" },
      { s: ">\n                Watch Via Meet\n              <", r: ">\n                {{ t('Watch_Via_Meet') }}\n              <" },
      { s: ">Document Preview<", r: ">{{ t('Document_Preview') }}<" },
      { s: ">PDF Preview<", r: ">{{ t('PDF_Preview') }}<" },
      { s: ">\\n                    Download\\n                  <", r: ">\\n                    {{ t('Download') }}\\n                  <" },
      { s: ">\n                    Download\n                  <", r: ">\n                    {{ t('Download') }}\n                  <" },
      { s: ">Distinguished Panel<", r: ">{{ t('Distinguished_Panel') }}<" },
      { s: ">Strategic Schedule<", r: ">{{ t('Strategic_Schedule') }}<" },
      { s: ">Programme Atmosphere<", r: ">{{ t('Programme_Atmosphere') }}<" },
      { s: ">Programme information is currently being finalized.<", r: ">{{ t('Programme_Finalizing') }}<" },
      { s: ">Secure Pass<", r: ">{{ t('Secure_Pass') }}<" },
      { s: ">Registration portal is currently active for this initiative.<", r: ">{{ t('Registration_Active') }}<" },
      { s: ">Register Entry<", r: ">{{ t('Register_Entry') }}<" },
      { s: ">Resource Archive<", r: ">{{ t('Resource_Archive') }}<" },
      { s: ">Download Brief<", r: ">{{ t('Download_Brief') }}<" },
      { s: ">Share Brief<", r: ">{{ t('Share_Brief') }}<" },
      { s: ">\\n                Share Initiative\\n              <", r: ">\\n                {{ t('Share_Initiative') }}\\n              <" },
      { s: ">\n                Share Initiative\n              <", r: ">\n                {{ t('Share_Initiative') }}\n              <" }
    ]
  }
];

filesToFix.forEach(({ file, replacements }) => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add useI18n import and t extraction if missing
  if (!content.includes("const { t } = useI18n()")) {
    if (content.includes("<script setup")) {
      // Find the end of imports or start of logic
      if (!content.includes("import { useI18n }")) {
        content = content.replace(/<script setup[^>]*>/, "$&\nimport { useI18n } from '@/composables/useI18n'");
      }
      content = content.replace(/<script setup[^>]*>([\s\S]*?)const/, "<script setup lang=\"ts\">\n$1\nconst { t } = useI18n()\nconst");
      changed = true;
    }
  }

  replacements.forEach(({ s, r }) => {
    if (content.includes(s)) {
      content = content.split(s).join(r);
      changed = true;
    } else {
      console.log(`String not found in ${file}:`, s);
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
