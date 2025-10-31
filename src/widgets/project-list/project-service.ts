import type { HostAPI } from '../../../@types/globals';

export interface Project {
    id: string;
    name: string;
    key?: string;
}

export interface ProjectsResponse {
    projects: Project[];
    total: number;
    skip: number;
    top: number;
}

interface YouTrackProjectRaw {
    id: string;
    name: string;
    shortName?: string;
}

type YouTrackProjectsResponse = Project[];

const TOP_PROJECTS_COUNT = 100;

export class ProjectService {
    constructor(private readonly host: HostAPI) { }

    async fetchProjects(): Promise<ProjectsResponse> {
        try {
            const response = await this.host.fetchYouTrack<YouTrackProjectsResponse>(
                'admin/projects',
                {
                    query: {
                        fields: 'id,name,shortName',
                        $top: TOP_PROJECTS_COUNT.toString()
                    }
                }
            );

            const projects = this.parseProjectsResponse(response);

            return {
                projects,
                total: projects.length,
                skip: 0,
                top: TOP_PROJECTS_COUNT
            };
        } catch (error) {
            throw error;
        }
    }

    private parseProjectsResponse(response: unknown): Project[] {
        if (!this.isYouTrackProjectsResponse(response)) {
            return [];
        }

        return response
            .filter(this.isProjectRaw)
            .map(this.transformProject);
    }

    private isYouTrackProjectsResponse(
        value: unknown
    ): value is YouTrackProjectsResponse {
        return Array.isArray(value);
    }

    private isProjectRaw(
        value: unknown
    ): value is YouTrackProjectRaw {
        if (typeof value !== 'object' || value === null) {
            return false;
        }

        const candidate = value as Record<string, unknown>;

        return (
            typeof candidate.id === 'string' &&
            typeof candidate.name === 'string' &&
            (candidate.shortName === undefined ||
                typeof candidate.shortName === 'string')
        );
    }

    private transformProject(raw: YouTrackProjectRaw): Project {
        return {
            id: raw.id,
            name: raw.name,
            key: raw.shortName ?? raw.id
        };
    }
}

