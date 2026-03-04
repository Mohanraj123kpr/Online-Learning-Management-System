import { Certificate } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Award, Download, Share2 } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate;
  open: boolean;
  onClose: () => void;
}

export function CertificateModal({ certificate, open, onClose }: CertificateModalProps) {
  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    console.log('Downloading certificate...');
  };

  const handleShare = () => {
    // In a real app, this would open share dialog
    console.log('Sharing certificate...');
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Certificate of Completion</DialogTitle>
        </DialogHeader>

        <div className="relative rounded-lg border-8 border-double border-blue-600 bg-gradient-to-br from-blue-50 to-purple-50 p-12">
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <Award className="size-16 text-blue-600" />
          </div>

          <div className="mt-12 space-y-8 text-center">
            <div>
              <h2 className="mb-2 text-3xl text-gray-800">
                Certificate of Completion
              </h2>
              <p className="text-gray-600">This certifies that</p>
            </div>

            <div>
              <p className="mb-2 text-4xl text-blue-600">
                {certificate.studentName}
              </p>
              <div className="mx-auto h-1 w-64 bg-blue-600"></div>
            </div>

            <div>
              <p className="text-gray-600">has successfully completed</p>
              <p className="mt-2 text-2xl text-gray-800">
                {certificate.courseName}
              </p>
            </div>

            <div className="flex items-center justify-between pt-8">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">
                  {certificate.completedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Instructor</p>
                <p className="font-medium">{certificate.instructor}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Certificate ID</p>
                <p className="font-medium">{certificate.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="size-4" />
            Share
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="size-4" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}