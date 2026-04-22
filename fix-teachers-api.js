const fs = require('fs');

const file = './src/lib/api/teachers.ts';
let content = fs.readFileSync(file, 'utf8');

// remove previous broken append if exists
content = content.replace(/export const getTeacherProfile = .*?5\.0;/s, '');

content += `
export const getVerifiedTeachers = teachersAPI.getAll;
export const getTeacherProfile = async (id: string) => { const res = await api.get('/teachers/' + id); return res.data; };
export const getSimilarTeachers = async (id: string) => [];
export const getTeacherDisplayName = (t: any) => t?.user ? t.user.firstName + ' ' + t.user.lastName : 'Unknown';
export const parseSubjects = (t: any) => t?.specialization ? [t.specialization] : [];
export const parseLanguages = (t: any) => ['English'];
export const formatRating = (t: any) => '5.0';
`;

fs.writeFileSync(file, content);
