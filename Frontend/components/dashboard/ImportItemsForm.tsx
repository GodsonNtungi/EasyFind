import React, {useEffect, useState} from 'react';
import {Box, Button, Text, Group, useMantineTheme, Divider, Space} from "@mantine/core";
import {Dropzone, IMAGE_MIME_TYPE, MIME_TYPES} from "@mantine/dropzone";
import {parse, unparse} from 'papaparse';
import {DataTable} from 'mantine-datatable';
import {IconPhoto, IconUpload, IconX} from "@tabler/icons";
import {downloadBlob, processDataImport} from "../../lib/utils";
import {definitions} from "../../types/database";
import {showNotification} from "@mantine/notifications";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import axios from "axios";

const PAGE_SIZES = [10, 15, 20];

function ImportItemsForm({
                             currentStore,
                             closeModal = () => {
                             }
                         }: { closeModal: Function, currentStore: definitions['stores'] }) {

    const [records, setRecords] = useState([]);
    const [dataHeaders, setHeaders] = useState([]);
    const [loading, setLoading] = useState(false);

    let recordsToProcess: any[] = []
    let headers: any[] = []
    const sampleCsv = unparse({
        "fields": ["name", "description", "sale_price", "discount_price", "category"],
        "data": []
    })
    const sampleCsvBlob = new Blob([sampleCsv], {type: 'text/csv;charset=utf-8;'});

    const theme = useMantineTheme();
    return (
        <Box>
            <Button mb={'sm'} onClick={() => downloadBlob("tiririka-import.csv", sampleCsvBlob)}>Download sample
                csv</Button>
            <Dropzone
                onDrop={(files) => {
                    setRecords([])
                    setHeaders([])
                    parse(files[0], {
                        complete(results, file) {
                            // console.log(results, file)
                            // @ts-ignore
                            headers = results?.data[0]
                            recordsToProcess = results?.data.slice(1, results?.data.length)
                            // @ts-ignore
                            setHeaders(headers)
                            processCsv(headers, recordsToProcess).then((items) => {
                                // @ts-ignore
                                setRecords(items)
                                console.log(items)
                            })
                        }
                    })
                }}
                onReject={(files) => console.log('rejected files', files)}
                maxSize={3 * 1024 ** 2}
                accept={[MIME_TYPES.csv]}
            >
                <Group position="center" spacing="xl" style={{minHeight: '120', pointerEvents: 'none'}}>
                    <Dropzone.Accept>
                        <IconUpload
                            size="3.2rem"
                            stroke={1.5}
                            color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX
                            size="3.2rem"
                            stroke={1.5}
                            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconPhoto size="3.2rem" stroke={1.5}/>
                    </Dropzone.Idle>

                    <div>
                        <Text size="xl" inline>
                            Drag csv file here or click to select file
                        </Text>
                    </div>
                </Group>
            </Dropzone>
            <Group py={'sm'} grow>
                <Button onClick={() => {
                    setLoading(true)
                    try {
                        axios.post("/api/load_products?store_id=" + currentStore.id.toString(), records).then(response => {
                            if (response.status === 200) {
                                showNotification({
                                    title: "Import Success",
                                    message: `Successfully loaded ${records.length} items `
                                })
                                setRecords([])
                            } else {
                                console.log(response.data)
                                showNotification({
                                    title: "Import Error",
                                    message: response.data
                                })
                            }
                            setLoading(false)
                        })
                    } catch (e) {
                        showNotification({
                            // @ts-ignore
                            title: e?.title,
                            // @ts-ignore
                            message: e?.message
                        })
                        setLoading(false)
                    }
                }} size={'md'} disabled={records.length == 0} loading={loading}>Start uploading</Button>
            </Group>
            <DataTableComponent data={records} headers={dataHeaders}/>
        </Box>

    );
}

async function processCsv(headers: any[], records: any[][]) {
    return records.map((value, index, array) => {
        let row: Map<string, string> = new Map<string, string>();
        headers.forEach((item, item_index) => {
            row.set(item, value[item_index])
        })
        return Object.fromEntries(row)
    })
}


function DataTableComponent({data, headers}: { data: any[], headers: any[] }) {
    const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    const [page, setPage] = useState(1);
    const [records, setRecords] = useState(data.slice(0, pageSize));

    useEffect(() => {
        // console.log(data)
        setRecords(data.slice(0, pageSize))
    }, [data])


    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords(data.slice(from, to));
    }, [page, pageSize]);

    return (
        <Box sx={{height: '70vh'}}>
            <DataTable
                withBorder
                records={records}
                columns={headers.map((value) => {
                    return {
                        accessor: value,
                    }
                })}
                totalRecords={data.length}
                recordsPerPage={pageSize}
                page={page}
                onPageChange={(p) => setPage(p)}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={setPageSize}
            />
        </Box>
    );
}

export default ImportItemsForm;