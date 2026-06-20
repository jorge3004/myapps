import React, { useEffect, useMemo, useState } from 'react';
import { Box, Chip, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography } from '@mui/material';
import apiService from '../services/apiService';

function renderHealthColor(meta) {
    if (!meta) return 'default';
    if (meta.fallbackApplied) return 'warning';
    if (meta.servedDataSource === 'mysql' && meta.mysqlAvailable) return 'success';
    if (meta.servedDataSource === 'memory') return 'info';
    return 'default';
}

const RuntimeSourcePanel = () => {
    const [selection, setSelection] = useState(apiService.getRuntimeSelection());
    const [runtimeStatus, setRuntimeStatus] = useState(null);
    const [meta, setMeta] = useState(apiService.getLastRuntimeMeta());
    const [loading, setLoading] = useState(false);

    const allowedEnvironments = useMemo(() => {
        return runtimeStatus?.available?.environments || ['dev', 'prod'];
    }, [runtimeStatus]);

    const allowedDataSources = useMemo(() => {
        return runtimeStatus?.available?.dataSources || ['mysql', 'memory'];
    }, [runtimeStatus]);

    const refreshStatus = async () => {
        setLoading(true);
        try {
            const status = await apiService.getRuntimeStatus();
            setRuntimeStatus(status);
            setMeta(apiService.getLastRuntimeMeta());
        } catch {
            setRuntimeStatus(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshStatus();
    }, []);

    useEffect(() => {
        const onSelectionUpdated = () => {
            setSelection(apiService.getRuntimeSelection());
            refreshStatus();
        };

        const onMetaUpdated = () => {
            setMeta(apiService.getLastRuntimeMeta());
        };

        window.addEventListener('runtime-selection-updated', onSelectionUpdated);
        window.addEventListener('runtime-meta-updated', onMetaUpdated);

        return () => {
            window.removeEventListener('runtime-selection-updated', onSelectionUpdated);
            window.removeEventListener('runtime-meta-updated', onMetaUpdated);
        };
    }, []);

    const handleEnvironmentChange = (event) => {
        apiService.setRuntimeSelection({
            environment: event.target.value,
            dataSource: selection.dataSource
        });
    };

    const handleDataSourceChange = (event) => {
        apiService.setRuntimeSelection({
            environment: selection.environment,
            dataSource: event.target.value
        });
    };

    return (
        <Paper
            elevation={4}
            sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 1400,
                p: 1.5,
                width: { xs: 'calc(100vw - 24px)', sm: 340 },
                maxWidth: 'calc(100vw - 24px)',
                borderRadius: 2
            }}
        >
            <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">Runtime Source</Typography>
                    <Chip
                        size="small"
                        color={renderHealthColor(meta)}
                        label={meta?.fallbackApplied ? 'Fallback active' : (meta?.servedDataSource || 'unknown')}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl size="small" fullWidth>
                        <InputLabel id="runtime-env-label">Environment</InputLabel>
                        <Select
                            labelId="runtime-env-label"
                            label="Environment"
                            value={selection.environment}
                            onChange={handleEnvironmentChange}
                        >
                            {allowedEnvironments.map((env) => (
                                <MenuItem key={env} value={env}>{env}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" fullWidth>
                        <InputLabel id="runtime-source-label">Source</InputLabel>
                        <Select
                            labelId="runtime-source-label"
                            label="Source"
                            value={selection.dataSource}
                            onChange={handleDataSourceChange}
                        >
                            {allowedDataSources.map((source) => (
                                <MenuItem key={source} value={source}>{source}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Typography variant="caption" color="text.secondary">
                    Requested: {meta?.requestedEnvironment || selection.environment} / {meta?.requestedDataSource || selection.dataSource}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Served: {meta?.servedEnvironment || '-'} / {meta?.servedDataSource || '-'} {meta?.fallbackApplied ? '(fallback)' : ''}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    MySQL: {meta?.mysqlAvailable ? 'available' : 'unavailable'} {loading ? '· refreshing' : ''}
                </Typography>
            </Stack>
        </Paper>
    );
};

export default RuntimeSourcePanel;
