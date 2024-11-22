import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { FolderIcon, ShieldAlert, ExternalLink } from 'lucide-react';
import { Document } from '@/lib/faker/documents/schema';
import { Card, CardContent } from '@/components/ui/card';
import { DocumentDialog } from '../common/document-dialog';
import { formatBadgeText, getStatusVariant } from '@/lib/controls';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RecentDocumentsProps {
  documents: Document[];
}

const RecentDocuments: React.FC<RecentDocumentsProps> = ({ documents }) => {
  const [selectedItem, setSelectedItem] = useState<Document | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const uniqueDocuments = documents.filter(
    (doc, index, self) =>
      index === self.findIndex((d) => d.title === doc.title && d.code === doc.code)
  );

  const handleCardClick = (doc: Document) => {
    setSelectedItem(doc);
  };

  const getClassificationColor = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'confidential':
        return 'bg-red-100 text-red-700';
      case 'restricted':
        return 'bg-orange-100 text-orange-700';
      case 'internal':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  return (
    <>
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {uniqueDocuments.map((doc, index) => (
          <TooltipProvider key={`${doc.id}-${index}`} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className={`
                      group relative overflow-hidden
                      transition-all duration-300 ease-in-out
                      hover:bg-accent/50 hover:shadow-lg
                      cursor-pointer border-l-4
                      ${hoveredId === doc.id ? 'border-l-primary scale-[1.02]' : 'border-l-transparent'}
                    `}
                    onClick={() => handleCardClick(doc)}
                    onMouseEnter={() => setHoveredId(doc.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <CardContent className="p-4 flex items-center gap-4 relative">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-background">
                          <AvatarImage
                            src={''}
                            alt="Document Icon"
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-primary/10">
                            <FolderIcon className="h-6 w-6 text-primary" />
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>

                      <div className="flex-grow min-w-0">
                        <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors duration-300">
                          {doc.title}
                          {hoveredId === doc.id && (
                            <ExternalLink className="inline-block ml-2 h-4 w-4 opacity-50" />
                          )}
                        </h4>

                        <motion.div 
                          className="flex flex-wrap items-center gap-2 mt-2"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Badge 
                            variant="outline" 
                            className="text-xs font-medium transform transition-transform hover:scale-105"
                          >
                            {doc.code}
                          </Badge>
                          <Badge
                            variant={getStatusVariant(doc.status)}
                            className="text-xs font-medium transform transition-transform hover:scale-105"
                          >
                            {formatBadgeText(doc.status)}
                          </Badge>
                        </motion.div>
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Badge
                          variant="secondary"
                          className="whitespace-nowrap font-medium transform transition-transform hover:scale-105"
                        >
                          {formatBadgeText(doc.origin_office)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(doc.date_created), 'MMM d, yyyy')}
                        </span>
                      </div>

                      {hoveredId === doc.id && (
                        <motion.div
                          className="absolute inset-0 bg-primary/5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="end"
                className={`px-3 py-2 flex items-center gap-2 font-medium ${getClassificationColor(doc.classification)}`}
              >
                <ShieldAlert className="h-4 w-4" />
                <p className="text-sm capitalize">{doc.classification || 'Public'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <DocumentDialog
            item={selectedItem}
            open={!!selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default RecentDocuments;