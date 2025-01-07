'use client';

import React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/database.types';

interface ProjectListProps {
	clientId?: string;
}

export default function ProjectList({ clientId }: ProjectListProps) {
	const [projects, setProjects] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState(true);
	const supabase = createClientComponentClient<Database>();

	React.useEffect(() => {
		async function fetchProjects() {
			try {
				let query = supabase
					.from('projects')
					.select('*')
					.order('created_at', { ascending: false });

				if (clientId) {
					query = query.eq('client_id', clientId);
				}

				const { data } = await query;
				setProjects(data || []);
			} catch {
				console.error('Error fetching projects');
			} finally {
				setLoading(false);
			}
		}

		fetchProjects();
	}, [clientId, supabase]);

	if (loading) {
		return <div>Loading projects...</div>;
	}

	if (projects.length === 0) {
		return <div>No projects found</div>;
	}

	return (
		<div className="space-y-4">
			{projects.map((project) => (
				<div key={project.id} className="p-4 border rounded-lg">
					<h3 className="font-semibold">{project.name}</h3>
					{project.description && (
						<p className="text-sm text-muted-foreground">{project.description}</p>
					)}
					<div className="mt-2 flex items-center gap-4 text-sm">
						<span>
							<span className="font-medium">Status:</span> {project.status}
						</span>
						{project.created_at && (
							<span className="text-muted-foreground">
								Created {formatDistanceToNow(new Date(project.created_at))} ago
							</span>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

