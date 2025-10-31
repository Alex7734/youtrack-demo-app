import React, { memo, useCallback, useEffect, useState } from 'react';
import Toggle from '@jetbrains/ring-ui-built/components/toggle/toggle';
import Loader from '@jetbrains/ring-ui-built/components/loader/loader';
import { ProjectService, type Project } from './project-service';
import { ToggleService } from './toggle-service';
import { TApiData, createApiData, createLoadingApiData, createErrorApiData } from './types';

const host = await YTApp.register();
const projectService = new ProjectService(host);
const toggleService = new ToggleService(host);

const AppComponent: React.FunctionComponent = () => {
  const [projects, setProjects] = useState<TApiData<Project[]>>(createLoadingApiData());
  const [toggleFlag, setToggleFlag] = useState<TApiData<boolean>>(createLoadingApiData());

  const fetchProjects = useCallback(async () => {
    setProjects(createLoadingApiData());
    try {
      const response = await projectService.fetchProjects();
      setProjects(createApiData(response.projects));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setProjects(createErrorApiData(errorMessage));
    }
  }, []);

  const loadToggleFlag = useCallback(async () => {
    setToggleFlag(createLoadingApiData());
    try {
      const enabled = await toggleService.loadFlag();
      setToggleFlag(createApiData(enabled));
    } catch (err) {
      setToggleFlag(createApiData(false));
    }
  }, []);

  const handleToggleChange = useCallback(async () => {
    const newValue = !toggleFlag.data;
    setToggleFlag(prev => ({ ...prev, loading: true, error: null }));
    try {
      await toggleService.saveFlag(newValue);
      setToggleFlag(createApiData(newValue));
    } catch (err) {
      setToggleFlag(createApiData(!newValue));
    }
  }, [toggleFlag.data]);

  useEffect(() => {
    fetchProjects();
    loadToggleFlag();
  }, [fetchProjects, loadToggleFlag]);

  return (
    <div className="widget">
      <div style={{ marginBottom: 'calc(var(--ring-unit) * 2)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'calc(var(--ring-unit) * 2)',
          background: 'var(--ring-sidebar-background-color)',
          borderRadius: 'var(--ring-border-radius)'
        }}>
          <div>
            <h3 style={{ margin: 0, marginBottom: 'var(--ring-unit)' }}>
              Test Management System
            </h3>
            <p style={{ margin: 0, color: 'var(--ring-secondary-color)' }}>
              Press the toggle to see me switch!! No, seriously, it's working!
            </p>
          </div>
          <Toggle
            checked={toggleFlag.data}
            onChange={handleToggleChange}
            disabled={toggleFlag.loading}
          />
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: 'var(--ring-unit)' }}>Available Projects</h3>
        {projects.loading ? (
          <Loader />
        ) : projects.error ? (
          <div style={{ color: 'var(--ring-error-color)', padding: 'var(--ring-unit)' }}>
            {projects.error}
          </div>
        ) : projects.data.length === 0 ? (
          <div style={{ padding: 'var(--ring-unit)', color: 'var(--ring-secondary-color)' }}>
            No projects found
          </div>
        ) : (
          <div style={{
            border: '1px solid var(--ring-border-color)',
            borderRadius: 'var(--ring-border-radius)',
            overflow: 'hidden'
          }}>
            {projects.data.map((project, index) => (
              <div
                key={project.id}
                style={{
                  padding: 'var(--ring-unit)',
                  borderBottom: index < projects.data.length - 1
                    ? '1px solid var(--ring-border-color)'
                    : 'none',
                  backgroundColor: 'var(--ring-content-background-color)'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: 'calc(var(--ring-unit) / 2)' }}>
                  {project.name}
                </div>
                {project.key && (
                  <div style={{
                    fontSize: 'var(--ring-font-size-smaller)',
                    color: 'var(--ring-secondary-color)'
                  }}>
                    Key: {project.key}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const App = memo(AppComponent);
