import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X, AlertTriangle, Lightbulb, RefreshCw, Loader2, Check, Target, Zap } from 'lucide-react';
import { useProjects } from '@/context/ProjectContext';

interface AIAnalysisResult {
  similarityPercentage: number;
  overlappingPoints: string[];
  improvementSuggestions: string[];
  recommendedTechnologies: string[];
  finalVerdict: string;
}

interface AIAnalysisButtonProps {
  title: string;
  abstract: string;
  technologies: string[];
  department?: string;
  projectId?: string; // If viewing existing project
}

const AIAnalysisButton = ({ title, abstract, technologies, department = 'mca', projectId }: AIAnalysisButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getApprovedProjects } = useProjects();

  const analyzeProject = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const requestData = {
        department,
        title,
        abstractText: abstract,
        technologies: technologies.join(', '),
      };

      const response = await fetch('http://localhost:2111/ai/abstract-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const responseText = await response.text();
      
      // Check if response is valid JSON
      if (!responseText) {
        throw new Error('API returned empty response');
      }

      // Remove markdown code block formatting if present
      let cleanJson = responseText;
      if (responseText.includes('```')) {
        // Extract JSON from markdown code blocks
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          cleanJson = jsonMatch[1];
        }
      }

      const data = JSON.parse(cleanJson);
      setAnalysis(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze project';
      setError(errorMessage);
      console.error('AI Analysis Error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 70) return 'text-destructive';
    if (score >= 40) return 'text-accent';
    return 'text-primary';
  };

  const getSimilarityBadge = (score: number) => {
    if (score >= 70) return <Badge variant="destructive">High Similarity</Badge>;
    if (score >= 40) return <Badge className="bg-accent/20 text-accent hover:bg-accent/30">Moderate Similarity</Badge>;
    return <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Low Similarity</Badge>;
  };

  const getVerdictColor = (verdict: string) => {
    const lower = verdict.toLowerCase();
    if (lower.includes('significant revision') || lower.includes('rejected')) {
      return 'border-destructive/50 bg-destructive/5';
    }
    if (lower.includes('minor') || lower.includes('revision needed')) {
      return 'border-accent/50 bg-accent/5';
    }
    return 'border-primary/50 bg-primary/5';
  };

  const getVerdictIcon = (verdict: string) => {
    const lower = verdict.toLowerCase();
    if (lower.includes('significant revision') || lower.includes('rejected')) {
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    }
    if (lower.includes('minor') || lower.includes('revision needed')) {
      return <Zap className="h-5 w-5 text-accent" />;
    }
    return <Check className="h-5 w-5 text-primary" />;
  };

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setIsOpen(true);
          if (!analysis && !error) analyzeProject();
        }}
        className="gap-2"
      >
        <Sparkles className="h-4 w-4" />
        AI Analysis
      </Button>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Analysis
          </CardTitle>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={analyzeProject}
              disabled={isAnalyzing}
            >
              <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false);
                setError(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Analyzing your project...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">Analysis Failed</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">Make sure the API server is running at http://localhost:2111</p>
          </div>
        ) : analysis ? (
          <>
            {/* Similarity Percentage */}
            <div className="p-4 bg-secondary rounded-lg border-2 border-primary">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-base">Similarity Score</span>
                {getSimilarityBadge(analysis.similarityPercentage)}
              </div>
              <div className="text-4xl font-bold mb-3">
                <span className={getSimilarityColor(analysis.similarityPercentage)}>
                  {analysis.similarityPercentage}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    analysis.similarityPercentage >= 70
                      ? 'bg-destructive'
                      : analysis.similarityPercentage >= 40
                      ? 'bg-accent'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${analysis.similarityPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Overlapping Points */}
            {analysis.overlappingPoints && analysis.overlappingPoints.length > 0 && (
              <div className="p-4 bg-secondary border border-primary/30 rounded-lg">
                <h4 className="font-semibold text-primary flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4" />
                  Overlapping Points
                </h4>
                <ul className="space-y-2">
                  {analysis.overlappingPoints.map((point, i) => (
                    <li key={i} className="text-sm flex items-start gap-2 text-foreground">
                      <span className="text-primary mt-1">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Technologies */}
            {analysis.recommendedTechnologies && analysis.recommendedTechnologies.length > 0 && (
              <div className="p-4 bg-secondary border border-accent/30 rounded-lg">
                <h4 className="font-semibold text-accent flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4" />
                  Recommended Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.recommendedTechnologies.map((tech, i) => (
                    <Badge key={i} variant="outline" className="bg-accent/10 text-accent border-accent/30">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement Suggestions */}
            {analysis.improvementSuggestions && analysis.improvementSuggestions.length > 0 && (
              <div className="p-4 bg-secondary border border-accent/30 rounded-lg">
                <h4 className="font-semibold text-accent flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4" />
                  Improvement Suggestions
                </h4>
                <ul className="space-y-2">
                  {analysis.improvementSuggestions.map((suggestion, i) => (
                    <li key={i} className="text-sm flex items-start gap-2 text-foreground">
                      <span className="text-accent mt-1">→</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Final Verdict */}
            {analysis.finalVerdict && (
              <div className={`p-4 border-2 rounded-lg ${getVerdictColor(analysis.finalVerdict)}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getVerdictIcon(analysis.finalVerdict)}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Final Verdict</h4>
                    <p className="text-sm leading-relaxed">{analysis.finalVerdict}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default AIAnalysisButton;
