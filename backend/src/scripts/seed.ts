import { userRepository } from '../repositories/userRepository';
import { graphService } from '../services/graphService';

async function seed() {
  await userRepository.init();

  const students = [
    { name: 'Amina Yusuf', email: 'amina@ucc.edu', password: 'password123', department: 'Computer Science', strengths: ['Algorithms', 'Data Structures'], weakSubjects: ['UI Design'], skills: ['TypeScript', 'Node.js'], interests: ['AI', 'Debate'], availability: [{ day: 'Mon', startHour: 10, endHour: 14 }] },
    { name: 'Brian Okafor', email: 'brian@ucc.edu', password: 'password123', department: 'Software Engineering', strengths: ['UI Design'], weakSubjects: ['Algorithms'], skills: ['React', 'Figma'], interests: ['AI', 'Music'], availability: [{ day: 'Mon', startHour: 12, endHour: 16 }] },
    { name: 'Chioma Nwosu', email: 'chioma@ucc.edu', password: 'password123', department: 'Information Systems', strengths: ['Databases'], weakSubjects: ['Public Speaking'], skills: ['PostgreSQL', 'Python'], interests: ['Research', 'Music'], availability: [{ day: 'Tue', startHour: 9, endHour: 12 }] }
  ];

  for (const student of students) {
    const user = await userRepository.createAuthUser(student.name, student.email, student.password);
    await userRepository.updateProfile(user.id, {
      name: student.name,
      department: student.department,
      strengths: student.strengths,
      weakSubjects: student.weakSubjects,
      skills: student.skills,
      interests: student.interests,
      availability: student.availability
    });
    await graphService.createStudentNode(user.id, student.name, student.department);
  }

  const [a, b] = await Promise.all([
    userRepository.findByEmail('amina@ucc.edu'),
    userRepository.findByEmail('brian@ucc.edu')
  ]);

  if (a && b) {
    await graphService.connectStudents(a.id, b.id, 'STUDIES_WITH');
  }

  console.log('Seed complete');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
