'use client';

import Spinner from '@/app/components/Spinner';
import { useActionState } from "react";
import { createIssue, State } from '@/app/lib/action';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';


const IssueForm = () => {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useActionState(createIssue, initialState);

    return (
        <div className="max-w-md text-neutral">
            <form action={formAction}>
                <div className="card card-dash card-xl bg-base-100 w-full shadow-xl rounded-md p-4">
                <div className="card-body">
                    <div className="">
                    {/* Title */}
                    <div className="mb-4">
                        <label htmlFor="title" className="mb-2 text-base font-medium text-neutral">
                            Title
                        </label>
                        <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder=""
                        className="input input-lg"
                        />
                        <div id="title-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.title &&
                            state.errors.title.map((error: string) => (
                            <p className="mt-2 text-sm text-error" key={error}>
                                {error}
                            </p>
                            ))}
                        </div>
                    </div>
                    {/* Description */}
                    <div className="mb-4">
                        <label htmlFor="description" className="mb-2 text-base font-medium">
                        Description
                        </label>
                        <textarea
                        id="description"
                        name="description"
                        placeholder=""
                        className="textarea textarea-lg"
                        />
                        <div id="description-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.description &&
                            state.errors.description.map((error: string) => (
                            <p className="mt-2 text-sm text-error" key={error}>
                                {error}
                            </p>
                            ))}
                        </div>
                    </div>
                    {/* Issue Status */}
                    <fieldset className="fieldset">
                        <legend className="mb-2 block text-base font-medium fieldset-legend text-neutral">
                        Set the issue status
                        </legend>
                        <div className="flex gap-4">
                        <div className="flex items-center rounded-full bg-base-300 px-4 py-2">
                            <input
                            type="radio"
                            name="status"
                            value="OPEN"
                            id="open"
                            defaultChecked // Set OPEN as the default
                            className="radio radio-lg bg-secondary border-secondary-content checked:bg-secondary-content checked:text-secondary checked:border-secondary"
                            />
                            <label
                            htmlFor="open"
                            className="ml-2 cursor-pointer text-base font-medium"
                            >
                            Open
                            </label>
                        </div>
                        <div className="flex items-center rounded-full bg-base-300 px-4 py-2">
                            <input
                            type="radio"
                            name="status"
                            value="IN_PROGRESS"
                            id="progress"
                            className="radio radio-lg bg-info border-info-content checked:bg-info-content checked:text-info checked:border-info"
                            />
                            <label
                            htmlFor="progress"
                            className="ml-2 cursor-pointer text-base font-medium"
                            >
                            Progress
                            </label>
                        </div>
                        <div className="flex items-center rounded-full bg-base-300 px-4 py-2">
                            <input
                            type="radio"
                            name="status"
                            value="CLOSED"
                            id="closed"
                            className="radio radio-lg bg-success border-success-content checked:bg-success-content checked:text-success checked:border-success"
                            />
                            <label
                            htmlFor="closed"
                            className="ml-2 cursor-pointer text-base font-medium"
                            >
                            Closed
                            </label>
                        </div>
                        </div>
                        <div id="status-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.status &&
                            state.errors.status.map((error: string) => (
                            <p className="mt-2 text-sm text-error" key={error}>
                                {error}
                            </p>
                            ))}
                        </div>
                    </fieldset>

                    <div id="general-error" aria-live="polite" aria-atomic="true">
                        <p className="mt-2 text-sm text-error">{state.message}</p>
                    </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-5">
                    <Link
                        href="/dashboard/issues/list"
                        className="flex h-10 items-center rounded-lg bg-gray-200 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-300"
                    >
                        Cancel
                    </Link>
                    <SubmitButton />
                    </div>
                </div>
                </div>
            </form>
        </div>
    );
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button
        className="btn bg-accent h-10 px-4 transition-colors"
        type="submit"
        disabled={pending}
      >
        Create Issue {pending && <Spinner />}
      </button>
    );
}

export default IssueForm;
