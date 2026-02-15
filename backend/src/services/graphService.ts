import { neo4jDriver } from '../config/neo4j';

type RelationType = 'STUDIES_WITH' | 'WORKED_ON_PROJECT' | 'MENTORS' | 'SAME_INTEREST';

const memoryGraph = {
  nodes: new Set<string>(),
  edges: new Map<string, Set<string>>()
};

function edgeKey(a: string, b: string) {
  return [a, b].sort().join('::');
}

export const graphService = {
  async createStudentNode(studentId: string, name: string, department?: string) {
    if (!neo4jDriver) {
      memoryGraph.nodes.add(studentId);
      return;
    }
    const session = neo4jDriver.session();
    try {
      await session.run(
        `MERGE (s:Student {id: $id}) SET s.name=$name, s.department=$department`,
        { id: studentId, name, department: department ?? null }
      );
    } finally {
      await session.close();
    }
  },

  async connectStudents(fromId: string, toId: string, relation: RelationType) {
    if (fromId === toId) {
      return;
    }
    if (!neo4jDriver) {
      const key = edgeKey(fromId, toId);
      if (!memoryGraph.edges.has(key)) {
        memoryGraph.edges.set(key, new Set());
      }
      memoryGraph.edges.get(key)?.add(relation);
      return;
    }
    const session = neo4jDriver.session();
    try {
      await session.run(
        `MATCH (a:Student {id: $fromId}), (b:Student {id: $toId})
         MERGE (a)-[r:${relation}]-(b)
         SET r.updatedAt=datetime()`,
        { fromId, toId }
      );
    } finally {
      await session.close();
    }
  },

  async shortestPathDistance(fromId: string, toId: string): Promise<number> {
    if (!neo4jDriver) {
      if (fromId === toId) return 0;
      return memoryGraph.edges.has(edgeKey(fromId, toId)) ? 1 : 3;
    }
    const session = neo4jDriver.session();
    try {
      const result = await session.run(
        `MATCH (a:Student {id: $fromId}), (b:Student {id: $toId}),
         p = shortestPath((a)-[*..4]-(b))
         RETURN CASE WHEN p IS NULL THEN 5 ELSE length(p) END AS distance`,
        { fromId, toId }
      );
      return Number(result.records[0]?.get('distance') ?? 5);
    } finally {
      await session.close();
    }
  },

  async degreeCentrality(studentId: string): Promise<number> {
    if (!neo4jDriver) {
      return [...memoryGraph.edges.keys()].filter((key) => key.includes(studentId)).length;
    }
    const session = neo4jDriver.session();
    try {
      const result = await session.run(
        `MATCH (s:Student {id: $studentId})-[r]-() RETURN count(r) as degree`,
        { studentId }
      );
      return Number(result.records[0]?.get('degree') ?? 0);
    } finally {
      await session.close();
    }
  },

  async commonNeighbors(firstId: string, secondId: string): Promise<number> {
    if (!neo4jDriver) {
      return memoryGraph.edges.has(edgeKey(firstId, secondId)) ? 1 : 0;
    }
    const session = neo4jDriver.session();
    try {
      const result = await session.run(
        `MATCH (a:Student {id: $firstId})--(n)--(b:Student {id: $secondId})
         RETURN count(DISTINCT n) AS common`,
        { firstId, secondId }
      );
      return Number(result.records[0]?.get('common') ?? 0);
    } finally {
      await session.close();
    }
  }
};
