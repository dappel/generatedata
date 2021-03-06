import React from 'react';
import * as coreUtils from '~utils/coreUtils';
import { Controlled as CodeMirror } from 'react-codemirror2';

export type CodeMirrorWrapperProps = {
	theme: string; // TODO
	codeMirrorMode: string;
	showLineNumbers: boolean;
	enableLineWrapping: boolean;
};

const CodeMirrorWrapper = (props: any): JSX.Element => {
	const {
		rows, columns, exportType, exportTypeSettings, codeMirrorMode, theme, showLineNumbers, loadedExportTypes,
		enableLineWrapping
	} = props;
	const [code, setCode] = React.useState("");

	React.useEffect(() => {
		if (!columns.length || !rows.length) {
			return;
		}

		// console.log({ columns: cloneObj(columns), rows: cloneObj(rows) });

		// when to re-run!
		// add row -> easy
		// remove row -> easy
		// CHANGE row type -> ok
		// CHANGE row settings -> hard(ish)
		// change export type -> easy
		// change export type setting (which?) -> hard
		generatePreviewString(props)
			.then((str: string) => {
				setCode(str);
			});
	}, [rows, columns, exportType, exportTypeSettings, loadedExportTypes]);

	return (
		<CodeMirror
			value={code}
			onBeforeChange={(editor, data, value): void => setCode(value)}
			options={{
				mode: codeMirrorMode,
				theme,
				lineNumbers: showLineNumbers,
				lineWrapping: enableLineWrapping,
				readOnly: true
			}}
		/>
	);
};

export default CodeMirrorWrapper;

export const generatePreviewString = (props: any): Promise<any> => {
	const { rows, columns, exportType, exportTypeSettings, loadedExportTypes } = props;
	const exportTypeWorker = coreUtils.getExportTypeWorker();

	return new Promise((resolve) => {
		coreUtils.performTask('exportTypeWorker', exportTypeWorker, {
			rows,
			columns,
			exportType,
			exportTypeSettings,
			isFirstBatch: true,
			isLastBatch: true,
			workerResources: {
				workerUtils: coreUtils.getWorkerUtils(),
				exportTypes: coreUtils.getExportTypeWorkerMap(loadedExportTypes)
			}
		}, ({ data }: MessageEvent): void => {
			resolve(data);
		});
	});
};
