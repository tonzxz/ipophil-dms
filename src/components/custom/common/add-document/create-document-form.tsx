'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { doc_classification } from '@/lib/dms/data';
import { DialogClose } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useDocumentTypes } from '@/lib/services/document-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import {
    CreateDocumentData,
    createDocumentSchema,
} from '@/lib/validations/documents/create_documents';
import { useState } from 'react';

interface CreateDocumentFormProps {
    onSubmit: (data: CreateDocumentData) => Promise<void>;
    onClose: () => void;
    initialData?: Partial<CreateDocumentData>; // Optional for `Edit` mode
    actionType: 'Create' | 'Edit'; // Distinguish between `Create` and `Edit` modes
}

export const CreateDocumentForm: React.FC<CreateDocumentFormProps> = ({
    onSubmit,
    onClose,
    initialData,
    actionType,
}) => {
    
    const { documentTypes } = useDocumentTypes();
    
    const [isLoading, setLoading] = useState<boolean>(false);
    
    const form = useForm<CreateDocumentData>({
        resolver: zodResolver(createDocumentSchema),
        defaultValues: {
            title: initialData?.title || '',
            classification: initialData?.classification || '',
            type: initialData?.type ? documentTypes?.find((type)=> type.name == initialData.type)?.type_id : '' ,
        }, // Pre-fill fields for edit functionality
    });
    const handleSubmit = async (props:CreateDocumentData) => {
        setLoading(true);
        await onSubmit(props);
        setLoading(false);
    }

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-4">
            {/* Title Field */}
            <div>
                <label htmlFor="title" className="block mb-1">
                    Subject/Title *
                </label>
                <Input
                    id="title"
                    placeholder="Enter document title"
                    {...form.register('title')}
                    className="w-full"
                />
                {form.formState.errors.title && (
                    <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
                )}
            </div>

            {/* Classification Field */}
            <div>
                <label htmlFor="classification" className="block mb-1">
                    Classification *
                </label>
                <Controller
                    name="classification"
                    control={form.control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a classification" />
                            </SelectTrigger>
                            <SelectContent>
                                {doc_classification.map((classification) => (
                                    <SelectItem key={classification.value} value={classification.value}>
                                        {classification.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {form.formState.errors.classification && (
                    <p className="text-red-500 text-sm">{form.formState.errors.classification.message}</p>
                )}
            </div>

            {/* Type Field */}
            <div>
                <label htmlFor="type" className="block mb-1">
                    Type *
                </label>
                <Controller
                    name="type"
                    control={form.control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                {documentTypes?.map((type) => (
                                    <SelectItem key={type.type_id} value={type.type_id}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {form.formState.errors.type && (
                    <p className="text-red-500 text-sm">{form.formState.errors.type.message}</p>
                )}
            </div>

            {/* Auto-Generated Details */}
            {actionType === 'Create' && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            <p className="text-sm text-gray-500">
                                Note, the following will be automatically generated:
                            </p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-sm text-gray-500 list-disc list-inside">
                            <li>Document Code</li>
                            <li>Origin Office</li>
                            <li>Created By</li>
                            <li>Date Created</li>
                            <li>Empty Logbook</li>
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
                <Button
                disabled={isLoading}
                type="submit" variant="default">
                    {
                    isLoading ? 'Processing...' : 
                    actionType === 'Create' ? 'Create' : 'Update'}
                </Button>
                <DialogClose asChild>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </DialogClose>
            </div>
        </form>
    );
};
