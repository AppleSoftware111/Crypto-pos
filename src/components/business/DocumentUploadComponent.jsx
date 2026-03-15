import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileText, CheckCircle2, X, RefreshCw, FileCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useBusiness } from '@/context/BusinessContext';
import { businessStorageService } from '@/lib/businessStorageService';

const DocumentType = {
    GOV_ID: "Government ID",
    BIZ_REG: "Business Registration",
    TAX_ID: "Tax ID / TIN",
    PROOF_ADDR: "Proof of Address",
    SELFIE: "Selfie with ID"
};

const DocumentUploadComponent = ({ businessId, onComplete, isRegistrationMode = false, onUploadStatsChange }) => {
    const { refreshBusinesses } = useBusiness();
    const [files, setFiles] = useState({});
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const fileInputRefs = useRef({});
    const { toast } = useToast();

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    const handleFileChange = (type, e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation: Type
        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Invalid File Type",
                description: "Please upload PDF, JPG, or PNG.",
                variant: "destructive"
            });
            return;
        }

        // Validation: Size
        if (file.size > maxFileSize) {
            toast({
                title: "File Too Large",
                description: "Max size is 10MB.",
                variant: "destructive"
            });
            return;
        }

        const newFiles = { 
            ...files, 
            [type]: {
                fileObject: file, 
                name: file.name,
                size: file.size,
                type: file.type
            } 
        };
        
        setFiles(newFiles);
        
        // Notify parent about stats if in registration mode
        if (isRegistrationMode && onUploadStatsChange) {
            onUploadStatsChange(Object.keys(newFiles).length);
        }
    };

    const triggerUpload = (type) => {
        fileInputRefs.current[type]?.click();
    };

    const removeFile = (type) => {
        const newFiles = { ...files };
        delete newFiles[type];
        setFiles(newFiles);
        if (isRegistrationMode && onUploadStatsChange) {
            onUploadStatsChange(Object.keys(newFiles).length);
        }
    };

    const processUpload = async () => {
        setUploading(true);
        try {
            // Validate (relaxed for registration mode)
            if (!businessId && !isRegistrationMode) {
                throw new Error("Missing business ID");
            }

            const fileCount = Object.keys(files).length;
            if (fileCount === 0) {
                 toast({ title: "No Files Selected", description: "Please select at least one document to upload.", variant: "default" });
                 setUploading(false);
                 return;
            }

            // In registration mode, we just pretend to upload for UI feedback
            if (isRegistrationMode) {
                 // Simulate visual delay
                 for (const type of Object.keys(files)) {
                    setUploadProgress(prev => ({ ...prev, [type]: 'uploading' }));
                    await new Promise(resolve => setTimeout(resolve, 500));
                    setUploadProgress(prev => ({ ...prev, [type]: 'success' }));
                 }
                 toast({ title: "Documents Ready", description: "Documents will be submitted with your application." });
                 if (onComplete) onComplete();
                 setUploading(false);
                 return;
            }

            // Normal Dashboard Mode - Save to local storage service
            for (const [docType, fileData] of Object.entries(files)) {
                setUploadProgress(prev => ({ ...prev, [docType]: 'uploading' }));
                
                await new Promise(resolve => setTimeout(resolve, 800));

                businessStorageService.addDocument(businessId, {
                    documentType: docType,
                    fileName: fileData.name,
                    fileSize: fileData.size,
                    mimeType: fileData.type
                });

                setUploadProgress(prev => ({ ...prev, [docType]: 'success' }));
            }

            // Success Update
            if (refreshBusinesses) await refreshBusinesses();
            
            toast({ title: "Upload Complete", description: "Documents submitted successfully." });
            if (onComplete) onComplete();

        } catch (error) {
            console.error("Local Upload Error:", error);
            toast({
                title: "Upload Failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
             {!isRegistrationMode && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Document Verification
                    </h2>
                    <p className="text-muted-foreground text-sm">Upload documents to verify your business identity.</p>
                </div>
            )}
            
            <div className={`grid grid-cols-1 ${isRegistrationMode ? 'sm:grid-cols-1' : 'md:grid-cols-2'} gap-4 mb-6`}>
                {Object.values(DocumentType).map((type) => (
                    <div 
                        key={type} 
                        className={`
                            border-2 border-dashed rounded-xl p-4 text-center transition-all relative
                            ${files[type] ? 'border-green-400 bg-green-50 dark:bg-green-900/10' : 'border-gray-300 hover:border-primary'}
                        `}
                    >
                        <input
                            type="file"
                            hidden
                            ref={el => fileInputRefs.current[type] = el}
                            onChange={(e) => handleFileChange(type, e)}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            disabled={uploading}
                        />
                        
                        {files[type] ? (
                            <div className="relative flex items-center gap-3">
                                {uploading && uploadProgress[type] === 'uploading' ? (
                                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                                ) : uploadProgress[type] === 'success' ? (
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                ) : (
                                    <FileCheck className="w-8 h-8 text-blue-500" />
                                )}
                                
                                <div className="text-left overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate w-full">
                                        {type}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate w-[150px]">
                                        {files[type].name}
                                    </p>
                                </div>
                                
                                {!uploading && (
                                    <button 
                                        onClick={() => removeFile(type)}
                                        className="ml-auto bg-red-100 p-1.5 rounded-full text-red-500 hover:bg-red-200 shadow-sm"
                                        type="button"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div onClick={() => !uploading && triggerUpload(type)} className={uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer flex flex-col items-center py-2'}>
                                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{type}</p>
                                <p className="text-xs text-muted-foreground mt-0">Optional</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {!isRegistrationMode && (
                <Button 
                    onClick={processUpload} 
                    className="w-full" 
                    size="lg" 
                    disabled={uploading || Object.keys(files).length === 0}
                >
                    {uploading ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Submit Documents"
                    )}
                </Button>
            )}
            
            {isRegistrationMode && Object.keys(files).length > 0 && (
                <div className="text-center text-xs text-green-600 font-medium mt-2">
                    {Object.keys(files).length} document(s) selected for submission
                </div>
            )}
        </div>
    );
};

export default DocumentUploadComponent;